'use client';

import React, { useEffect, useState } from 'react';
import { Calendar, FileText, Mic, PenTool, ShieldCheck } from 'lucide-react';
import type { ExportableTask, GeneratedPDFReport } from '@/lib/chronos/export';
import { CalendarSyncView } from './CalendarSyncView';
import { PDFReportSearchPanel } from './PDFReportSearchPanel';
import {
  AIWorkOptimizerAndMalwareView,
  type TaskOptimizationPatch,
} from './AIWorkOptimizerAndMalwareView';
import {
  VoiceAndHandwritingModal,
  type ExtractedTaskDraft,
} from './VoiceAndHandwritingModal';

type HubTab = 'calendar' | 'pdf' | 'ai_security';

const STORAGE_KEY = 'bmclinics_chronos_lite_tasks_v1';

function makeTask(partial: Partial<ExportableTask> & { id: string; title: string }): ExportableTask {
  return {
    listId: 'bm-clinics',
    listName: 'BM Clinics',
    description: '',
    status: 'todo',
    priority: 'medium',
    dueDate: new Date().toISOString().slice(0, 10),
    reminderAt: '',
    estimatedMinutes: 30,
    tags: ['BM Clinics'],
    sourceType: 'manual',
    isEncrypted: false,
    assigneeEmail: 'kontakt@bujokmedical.pl',
    externalCalendarPlatform: '',
    ...partial,
  };
}

const DEFAULT_TASKS: ExportableTask[] = [
  makeTask({
    id: 'bm-1',
    title: 'Konsultacja kwalifikacyjna — Flebologia / Żylaki',
    description: 'Przegląd USG Doppler i plan zabiegowy pacjenta',
    status: 'todo',
    priority: 'high',
    dueDate: new Date().toISOString().slice(0, 10),
    estimatedMinutes: 30,
    tags: ['BM Clinics', 'Flebologia'],
  }),
  makeTask({
    id: 'bm-2',
    title: 'Kontrola pozabiegowa — Proktologia laserowa',
    description: 'Ocena rekonwalescencji i zaleceń po zabiegu ambulatoryjnym',
    status: 'in_progress',
    priority: 'medium',
    dueDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
    estimatedMinutes: 20,
    tags: ['BM Clinics', 'Proktologia'],
  }),
  makeTask({
    id: 'bm-3',
    title: 'Aktualizacja cennika i raport miesięczny PDF',
    description: 'Weryfikacja 21 usług w panelu CMS oraz eksport raportu PDF',
    status: 'todo',
    priority: 'medium',
    dueDate: new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10),
    estimatedMinutes: 45,
    tags: ['Administracja', 'CMS'],
  }),
];

export function ChronosLiteHub({
  initialTab = 'calendar',
  roleLabel = 'Panel Kliniki BM Clinics',
}: {
  initialTab?: HubTab;
  roleLabel?: string;
}) {
  const [activeTab, setActiveTab] = useState<HubTab>(initialTab);
  const [tasks, setTasks] = useState<ExportableTask[]>(DEFAULT_TASKS);
  const [autoTwoWaySync, setAutoTwoWaySync] = useState(false);
  const [generatedReports, setGeneratedReports] = useState<GeneratedPDFReport[]>([]);
  const [activeReportId, setActiveReportId] = useState<string | null>(null);
  const [includeIndexAppendix, setIncludeIndexAppendix] = useState(true);
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  const [voiceInitialTab, setVoiceInitialTab] = useState<'voice' | 'handwriting'>('voice');

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTasks(parsed);
        }
      }
    } catch {
      // Ignore storage read issues
    }
  }, []);

  const persistTasks = (updater: (prev: ExportableTask[]) => ExportableTask[]) => {
    setTasks((prev) => {
      const next = updater(prev);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Ignore quota errors
      }
      return next;
    });
  };

  const handleImportCalendarTasks = async (
    imported: Array<{
      title: string;
      description: string;
      dueDate: string;
      estimatedMinutes: number;
      externalCalendarPlatform?: string;
    }>,
    platform: string
  ) => {
    persistTasks((prev) => [
      ...prev,
      ...imported.map((item, idx) =>
        makeTask({
          id: `cal-${Date.now()}-${idx}`,
          title: item.title,
          description: item.description,
          dueDate: item.dueDate,
          estimatedMinutes: item.estimatedMinutes || 30,
          sourceType: 'calendar',
          externalCalendarPlatform: item.externalCalendarPlatform || platform,
          tags: ['Kalendarz', item.externalCalendarPlatform || platform],
        })
      ),
    ]);
  };

  const handleApplyExternalCalendarUpdates = async (
    updates: Array<{
      taskId: string;
      title: string;
      dueDate: string;
      externalCalendarPlatform: string;
    }>
  ) => {
    const map = new Map(updates.map((u) => [u.taskId, u]));
    persistTasks((prev) =>
      prev.map((t) => {
        const u = map.get(t.id);
        return u
          ? {
              ...t,
              title: u.title,
              dueDate: u.dueDate,
              externalCalendarPlatform: u.externalCalendarPlatform,
            }
          : t;
      })
    );
  };

  const handleMarkTaskSyncedWithPlatform = async (taskId: string, platformTag: string) => {
    persistTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              externalCalendarPlatform: platformTag,
              tags: Array.from(new Set([...(t.tags || []), platformTag])),
            }
          : t
      )
    );
  };

  const handleQuickAddDateTask = (dateIso: string) => {
    const title = window.prompt(`Nowe zadanie / termin na dzień ${dateIso}:`);
    if (!title || !title.trim()) return;
    persistTasks((prev) => [
      ...prev,
      makeTask({
        id: `quick-${Date.now()}`,
        title: title.trim(),
        description: 'Dodano z kalendarza BM Clinics',
        dueDate: dateIso,
      }),
    ]);
  };

  const handleApplyTaskOptimization = async (patch: TaskOptimizationPatch) => {
    persistTasks((prev) =>
      prev.map((t) =>
        t.id === patch.taskId
          ? {
              ...t,
              priority: patch.suggestedPriority ?? t.priority,
              estimatedMinutes: patch.suggestedMinutes ?? t.estimatedMinutes,
              description: patch.enhancedDescription || t.description,
              isEncrypted: patch.recommendEncryption ? true : t.isEncrypted,
            }
          : t
      )
    );
  };

  const handleCreateDraftTasks = async (drafts: ExtractedTaskDraft[], source: string) => {
    const sourceType: ExportableTask['sourceType'] =
      source === 'voice' || source === 'handwriting' ? source : 'manual';
    persistTasks((prev) => [
      ...prev,
      ...drafts.map((d, idx) => {
        const due = new Date(Date.now() + (d.dueDateOffsetDays || 0) * 86400000)
          .toISOString()
          .slice(0, 10);
        return makeTask({
          id: `draft-${Date.now()}-${idx}`,
          title: d.title,
          description: d.description || '',
          priority: d.priority || 'medium',
          dueDate: due,
          estimatedMinutes: d.estimatedMinutes || 30,
          sourceType,
          tags: d.tags?.length ? d.tags : [source],
        });
      }),
    ]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Chronos Vault — Stabilne Moduły Kliniki (bez 3D)
          </h1>
          <p className="text-sm opacity-75">
            {roleLabel} · Kalendarz, raporty PDF, notatki głosowe/odręczne oraz optymalizator AI
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setVoiceInitialTab('voice');
              setVoiceModalOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium hover:opacity-90"
            style={{ borderColor: 'var(--border-color)' }}
          >
            <Mic className="h-4 w-4" />
            Notatka głosowa
          </button>
          <button
            type="button"
            onClick={() => {
              setVoiceInitialTab('handwriting');
              setVoiceModalOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium hover:opacity-90"
            style={{ borderColor: 'var(--border-color)' }}
          >
            <PenTool className="h-4 w-4" />
            Pismo odręczne
          </button>
        </div>
      </div>

      <div
        className="flex flex-wrap gap-2 border-b pb-3"
        style={{ borderColor: 'var(--border-color)' }}
      >
        <button
          type="button"
          onClick={() => setActiveTab('calendar')}
          className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
            activeTab === 'calendar' ? 'bg-amber-500 text-black' : 'border opacity-80 hover:opacity-100'
          }`}
          style={activeTab === 'calendar' ? undefined : { borderColor: 'var(--border-color)' }}
        >
          <Calendar className="h-4 w-4" />
          Kalendarz i Synchronizacja
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('pdf')}
          className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
            activeTab === 'pdf' ? 'bg-amber-500 text-black' : 'border opacity-80 hover:opacity-100'
          }`}
          style={activeTab === 'pdf' ? undefined : { borderColor: 'var(--border-color)' }}
        >
          <FileText className="h-4 w-4" />
          Raporty PDF i Wyszukiwarka
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('ai_security')}
          className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
            activeTab === 'ai_security' ? 'bg-amber-500 text-black' : 'border opacity-80 hover:opacity-100'
          }`}
          style={activeTab === 'ai_security' ? undefined : { borderColor: 'var(--border-color)' }}
        >
          <ShieldCheck className="h-4 w-4" />
          Optymalizator AI i Bezpieczeństwo
        </button>
      </div>

      <div className="min-h-[420px]">
        {activeTab === 'calendar' && (
          <CalendarSyncView
            tasks={tasks}
            activeListName="BM Clinics — Harmonogram"
            googleAccessToken={null}
            autoTwoWaySync={autoTwoWaySync}
            onToggleAutoTwoWaySync={setAutoTwoWaySync}
            onConnectGoogleCalendar={async () => null}
            onImportCalendarTasks={handleImportCalendarTasks}
            onApplyExternalCalendarUpdates={handleApplyExternalCalendarUpdates}
            onMarkTaskSyncedWithPlatform={handleMarkTaskSyncedWithPlatform}
            onQuickAddDateTask={handleQuickAddDateTask}
          />
        )}

        {activeTab === 'pdf' && (
          <PDFReportSearchPanel
            tasksToExport={tasks}
            projectLabel="BM Clinics — Raport Operacyjny"
            periodLabel={new Date().toLocaleDateString('pl-PL')}
            scopeMode="all"
            reportVariant="productivity_and_tasks"
            includeIndexAppendix={includeIndexAppendix}
            onToggleIndexAppendix={setIncludeIndexAppendix}
            generatedReports={generatedReports}
            activeReportId={activeReportId}
            onSelectReport={setActiveReportId}
            onRegisterGeneratedReport={(report) => {
              setGeneratedReports((prev) => [report, ...prev]);
              setActiveReportId(report.id);
            }}
          />
        )}

        {activeTab === 'ai_security' && (
          <AIWorkOptimizerAndMalwareView
            tasks={tasks}
            activeListName="BM Clinics"
            onApplyTaskOptimization={handleApplyTaskOptimization}
            onCreateSuggestedTasks={handleCreateDraftTasks}
          />
        )}
      </div>

      <VoiceAndHandwritingModal
        isOpen={voiceModalOpen}
        initialTab={voiceInitialTab}
        onClose={() => setVoiceModalOpen(false)}
        onCreateTasks={handleCreateDraftTasks}
      />
    </div>
  );
}
