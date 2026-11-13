'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  Edit3,
  Check,
  X,
  Settings,
  Plus,
  Trash2,
  Terminal,
  RotateCcw,
  Sparkles,
  LogIn,
  LayoutDashboard,
  Save,
} from 'lucide-react';
import type { CmsSiteConfig, CmsState } from '@/lib/cmsStore';
import type { CatalogService } from '@/lib/servicesCatalog';

const STORAGE_OVERRIDES_KEY = 'bmclinics_cms_inline_overrides_v1';
const STORAGE_CONFIG_KEY = 'bmclinics_cms_site_config_v1';

export default function LiveEditorToolbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  const [cmsState, setCmsState] = useState<CmsState | null>(null);
  const [inlineMode, setInlineMode] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'services' | 'cli'>('content');
  const [pendingOverrides, setPendingOverrides] = useState<Record<string, string>>({});
  const [siteConfigDraft, setSiteConfigDraft] = useState<CmsSiteConfig | null>(null);
  const [editingService, setEditingService] = useState<CatalogService | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3200);
  }, []);

  // Load CMS state from API + merge with local browser overrides
  const fetchCms = useCallback(async () => {
    try {
      const res = await fetch('/api/cms', { cache: 'no-store' });
      if (!res.ok) return;
      const data = (await res.json()) as CmsState;

      let localOverrides: Record<string, string> = {};
      try {
        const raw = localStorage.getItem(STORAGE_OVERRIDES_KEY);
        if (raw) localOverrides = JSON.parse(raw);
      } catch {
        // ignore
      }

      const mergedOverrides = { ...(data.inlineOverrides ?? {}), ...localOverrides };
      let mergedConfig = data.siteConfig;
      try {
        const rawCfg = localStorage.getItem(STORAGE_CONFIG_KEY);
        if (rawCfg) mergedConfig = { ...mergedConfig, ...JSON.parse(rawCfg) };
      } catch {
        // ignore
      }

      setCmsState({
        ...data,
        siteConfig: mergedConfig,
        inlineOverrides: mergedOverrides,
      });
      setPendingOverrides(mergedOverrides);
      setSiteConfigDraft(mergedConfig);
    } catch {
      // ignore offline
    }
  }, []);

  useEffect(() => {
    fetchCms();
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('edit') === '1') {
        setInlineMode(true);
      }
      if (params.get('cms') === '1') {
        setDrawerOpen(true);
      }
    }
  }, [fetchCms]);

  // Apply inline text overrides and data-cms-field values to the DOM
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.querySelector('main');
    if (!root) return;

    // 1. Apply structured siteConfig fields if tagged with data-cms-field
    if (siteConfigDraft) {
      const tagged = document.querySelectorAll<HTMLElement>('[data-cms-field]');
      tagged.forEach((el) => {
        const field = el.dataset.cmsField as keyof CmsSiteConfig | undefined;
        if (field && typeof siteConfigDraft[field] === 'string') {
          if (document.activeElement !== el) {
            el.textContent = siteConfigDraft[field] as string;
          }
        }
      });
    }

    // 2. Tag and apply inlineOverrides on text leaf nodes inside <main>
    const candidates = root.querySelectorAll<HTMLElement>(
      'h1, h2, h3, h4, p, span, a, button, td, th, summary'
    );
    let idx = 0;
    candidates.forEach((el) => {
      if (el.closest('[data-cms-ignore]')) return;
      // Only target elements without nested block children
      const hasElementChildren = Array.from(el.children).some((child) =>
        ['DIV', 'SECTION', 'UL', 'TABLE', 'FORM', 'PICTURE', 'IMG', 'SVG', 'INPUT', 'SELECT'].includes(
          child.tagName
        )
      );
      if (hasElementChildren) return;
      const text = el.textContent?.trim();
      if (!text && !el.dataset.cmsKey) return;

      const key = el.dataset.cmsKey || `${pathname || '/'}::${el.tagName.toLowerCase()}::${idx}`;
      el.dataset.cmsKey = key;
      idx += 1;

      if (pendingOverrides[key] !== undefined && document.activeElement !== el) {
        el.textContent = pendingOverrides[key];
      }
    });
  }, [pathname, pendingOverrides, siteConfigDraft, cmsState]);

  // Enable/disable contentEditable when inlineMode changes
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.querySelector('main');
    if (!root) return;

    const elements = root.querySelectorAll<HTMLElement>('[data-cms-key], [data-cms-field]');

    const handleFocus = (e: Event) => {
      const target = e.currentTarget as HTMLElement;
      target.style.outline = '2px dashed #d4af37';
      target.style.outlineOffset = '3px';
      target.style.borderRadius = '4px';
    };

    const handleClick = (e: MouseEvent) => {
      if (!inlineMode) return;
      // Prevent links/buttons from navigating while editing inline text
      e.preventDefault();
      e.stopPropagation();
      const target = e.currentTarget as HTMLElement;
      target.focus();
    };

    const handleBlur = (e: Event) => {
      const target = e.currentTarget as HTMLElement;
      target.style.outline = '';
      target.style.outlineOffset = '';
      const newText = target.textContent?.trim() ?? '';
      const cmsField = target.dataset.cmsField as keyof CmsSiteConfig | undefined;
      const cmsKey = target.dataset.cmsKey;

      if (cmsField && siteConfigDraft && typeof siteConfigDraft[cmsField] === 'string') {
        setSiteConfigDraft((prev) => (prev ? { ...prev, [cmsField]: newText } : prev));
      }
      if (cmsKey) {
        setPendingOverrides((prev) => {
          const next = { ...prev, [cmsKey]: newText };
          try {
            localStorage.setItem(STORAGE_OVERRIDES_KEY, JSON.stringify(next));
          } catch {
            // ignore
          }
          return next;
        });
      }
    };

    elements.forEach((el) => {
      if (inlineMode) {
        el.contentEditable = 'true';
        el.style.cursor = 'text';
        el.setAttribute('spellcheck', 'false');
        el.addEventListener('focus', handleFocus);
        el.addEventListener('blur', handleBlur);
        el.addEventListener('click', handleClick, true);
      } else {
        el.removeAttribute('contenteditable');
        el.style.cursor = '';
        el.style.outline = '';
        el.removeEventListener('focus', handleFocus);
        el.removeEventListener('blur', handleBlur);
        el.removeEventListener('click', handleClick, true);
      }
    });

    return () => {
      elements.forEach((el) => {
        el.removeAttribute('contenteditable');
        el.style.cursor = '';
        el.style.outline = '';
        el.removeEventListener('focus', handleFocus);
        el.removeEventListener('blur', handleBlur);
        el.removeEventListener('click', handleClick, true);
      });
    };
  }, [inlineMode, pathname, siteConfigDraft]);

  async function saveAllChanges() {
    setSaving(true);
    try {
      try {
        localStorage.setItem(STORAGE_OVERRIDES_KEY, JSON.stringify(pendingOverrides));
        if (siteConfigDraft) {
          localStorage.setItem(STORAGE_CONFIG_KEY, JSON.stringify(siteConfigDraft));
        }
      } catch {
        // ignore
      }

      const res = await fetch('/api/cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteConfig: siteConfigDraft,
          inlineOverrides: pendingOverrides,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setCmsState(data.state);
        showToast('Zapisano zmiany na żywo (Online & CMS)!');
        router.refresh();
      } else {
        showToast('Zapisano w pamięci przeglądarki.');
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveService(e: React.FormEvent) {
    e.preventDefault();
    if (!editingService) return;
    setSaving(true);
    try {
      const res = await fetch('/api/cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'upsertService',
          service: editingService,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setCmsState(data.state);
        setEditingService(null);
        showToast('Usługa została zapisana!');
        router.refresh();
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteService(id: string) {
    setSaving(true);
    try {
      const res = await fetch('/api/cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'deleteService',
          id,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setCmsState(data.state);
        showToast('Usługa usunięta.');
        router.refresh();
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleResetOverrides() {
    setSaving(true);
    try {
      localStorage.removeItem(STORAGE_OVERRIDES_KEY);
      localStorage.removeItem(STORAGE_CONFIG_KEY);
      setPendingOverrides({});
      const res = await fetch('/api/cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'resetAll' }),
      });
      if (res.ok) {
        const data = await res.json();
        setCmsState(data.state);
        setSiteConfigDraft(data.state.siteConfig);
        showToast('Przywrócono domyślne treści strony.');
        window.location.reload();
      }
    } finally {
      setSaving(false);
    }
  }

  const isAdmin = session?.user?.role === 'ADMIN';

  return (
    <div data-cms-ignore="true" className="font-sans">
      {/* Toast notification */}
      {toast && (
        <div className="fixed top-20 right-4 z-[100] flex items-center gap-2 rounded-xl border border-[#d4af37]/50 bg-[#141310]/95 px-4 py-3 text-xs font-medium text-[#f4e7c3] shadow-2xl backdrop-blur-md">
          <Sparkles className="h-4 w-4 text-[#d4af37]" />
          <span>{toast}</span>
        </div>
      )}

      {/* Floating Bottom Studio Bar */}
      <div className="fixed right-4 bottom-4 z-[90] flex flex-wrap items-center gap-2 rounded-2xl border border-white/15 bg-[#12110e]/95 p-2 text-xs text-white shadow-[0_12px_40px_rgba(0,0,0,0.75)] backdrop-blur-xl">
        <button
          type="button"
          onClick={() => {
            if (inlineMode) {
              saveAllChanges();
              setInlineMode(false);
            } else {
              setInlineMode(true);
              showToast('Tryb edycji aktywny — kliknij dowolny tekst na stronie, aby go zmienić!');
            }
          }}
          className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 font-medium transition ${
            inlineMode
              ? 'bg-[#d4af37] text-black shadow-[0_0_20px_rgba(212,175,55,0.45)]'
              : 'bg-white/10 text-white hover:bg-white/15'
          }`}
        >
          {inlineMode ? <Check className="h-3.5 w-3.5" /> : <Edit3 className="h-3.5 w-3.5 text-[#d4af37]" />}
          <span>{inlineMode ? 'Zakończ i zapisz edycję' : 'Edytuj tekst na żywo'}</span>
        </button>

        {inlineMode && (
          <button
            type="button"
            onClick={saveAllChanges}
            disabled={saving}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-600/90 px-3 py-2 font-medium text-white transition hover:bg-emerald-500"
          >
            <Save className="h-3.5 w-3.5" />
            <span>{saving ? 'Zapisywanie...' : 'Zapisz teraz'}</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => setDrawerOpen((v) => !v)}
          className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-medium text-zinc-200 transition hover:bg-white/10"
        >
          <Settings className="h-3.5 w-3.5 text-[#d4af37]" />
          <span>Panel CMS & CLI</span>
        </button>

        {isAdmin ? (
          <Link
            href="/admin"
            className="flex items-center gap-1.5 rounded-xl border border-[#d4af37]/30 bg-[#d4af37]/10 px-3 py-2 font-medium text-[#f4e7c3] transition hover:bg-[#d4af37]/20"
          >
            <LayoutDashboard className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Admin</span>
          </Link>
        ) : (
          <Link
            href="/logowanie"
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-medium text-zinc-300 transition hover:bg-white/10"
          >
            <LogIn className="h-3.5 w-3.5 text-[#d4af37]" />
            <span className="hidden sm:inline">Logowanie</span>
          </Link>
        )}
      </div>

      {/* Slide-over Studio CMS Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[95] flex justify-end bg-black/60 backdrop-blur-xs">
          <div className="flex h-full w-full max-w-xl flex-col border-l border-white/15 bg-[#141310] text-zinc-100 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.2em] text-[#d4af37] uppercase">
                  BM Clinics Online Studio
                </p>
                <h2 className="text-base font-semibold text-white">
                  Edytor Treści, Usług i Projektu CLI
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="rounded-lg p-2 text-zinc-400 hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/10 px-6 pt-2 text-xs font-medium">
              <button
                type="button"
                onClick={() => setActiveTab('content')}
                className={`border-b-2 px-4 py-2.5 transition ${
                  activeTab === 'content'
                    ? 'border-[#d4af37] text-[#d4af37]'
                    : 'border-transparent text-zinc-400 hover:text-white'
                }`}
              >
                Treści główne i Kontakt
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('services')}
                className={`border-b-2 px-4 py-2.5 transition ${
                  activeTab === 'services'
                    ? 'border-[#d4af37] text-[#d4af37]'
                    : 'border-transparent text-zinc-400 hover:text-white'
                }`}
              >
                Usługi i Cennik ({cmsState?.services.length ?? 0})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('cli')}
                className={`border-b-2 px-4 py-2.5 transition ${
                  activeTab === 'cli'
                    ? 'border-[#d4af37] text-[#d4af37]'
                    : 'border-transparent text-zinc-400 hover:text-white'
                }`}
              >
                Narzędzie CLI & API
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 space-y-5 overflow-y-auto p-6 text-xs">
              {activeTab === 'content' && siteConfigDraft && (
                <div className="space-y-4">
                  <div className="rounded-xl border border-[#d4af37]/30 bg-[#d4af37]/5 p-3.5 text-zinc-300">
                    <p className="font-medium text-[#f4e7c3]">Wskazówka: Edycja bezpośrednia</p>
                    <p className="mt-1 opacity-80">
                      Możesz też zamknąć ten panel i kliknąć przycisk{' '}
                      <strong>„Edytuj tekst na żywo”</strong> na dole ekranu, aby kliknąć dowolny
                      nagłówek, opis lub przycisk bezpośrednio na stronie i zmienić jego treść.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <label className="space-y-1">
                      <span className="text-zinc-400">Telefon rejestracji</span>
                      <input
                        value={siteConfigDraft.phone}
                        onChange={(e) =>
                          setSiteConfigDraft({ ...siteConfigDraft, phone: e.target.value })
                        }
                        className="w-full rounded-lg border border-white/15 bg-black/40 p-2.5 text-white"
                      />
                    </label>
                    <label className="space-y-1">
                      <span className="text-zinc-400">E-mail kontaktowy</span>
                      <input
                        value={siteConfigDraft.email}
                        onChange={(e) =>
                          setSiteConfigDraft({ ...siteConfigDraft, email: e.target.value })
                        }
                        className="w-full rounded-lg border border-white/15 bg-black/40 p-2.5 text-white"
                      />
                    </label>
                    <label className="space-y-1">
                      <span className="text-zinc-400">Adres (linia 1)</span>
                      <input
                        value={siteConfigDraft.addressLine1}
                        onChange={(e) =>
                          setSiteConfigDraft({ ...siteConfigDraft, addressLine1: e.target.value })
                        }
                        className="w-full rounded-lg border border-white/15 bg-black/40 p-2.5 text-white"
                      />
                    </label>
                    <label className="space-y-1">
                      <span className="text-zinc-400">Adres (linia 2)</span>
                      <input
                        value={siteConfigDraft.addressLine2}
                        onChange={(e) =>
                          setSiteConfigDraft({ ...siteConfigDraft, addressLine2: e.target.value })
                        }
                        className="w-full rounded-lg border border-white/15 bg-black/40 p-2.5 text-white"
                      />
                    </label>
                  </div>

                  <label className="block space-y-1">
                    <span className="text-zinc-400">Nagłówek sekcji kafelków</span>
                    <input
                      value={siteConfigDraft.heroTitle}
                      onChange={(e) =>
                        setSiteConfigDraft({ ...siteConfigDraft, heroTitle: e.target.value })
                      }
                      className="w-full rounded-lg border border-white/15 bg-black/40 p-2.5 text-white"
                    />
                  </label>

                  <label className="block space-y-1">
                    <span className="text-zinc-400">Nagłówek sekcji Standard BMClinic</span>
                    <input
                      value={siteConfigDraft.standardTitle}
                      onChange={(e) =>
                        setSiteConfigDraft({ ...siteConfigDraft, standardTitle: e.target.value })
                      }
                      className="w-full rounded-lg border border-white/15 bg-black/40 p-2.5 text-white"
                    />
                  </label>

                  <label className="block space-y-1">
                    <span className="text-zinc-400">Opis sekcji Standard BMClinic</span>
                    <textarea
                      rows={3}
                      value={siteConfigDraft.standardBody}
                      onChange={(e) =>
                        setSiteConfigDraft({ ...siteConfigDraft, standardBody: e.target.value })
                      }
                      className="w-full rounded-lg border border-white/15 bg-black/40 p-2.5 text-white"
                    />
                  </label>

                  <div className="space-y-3 border-t border-white/10 pt-4">
                    <p className="font-semibold text-white">Kafelki specjalizacji (Strona główna)</p>
                    {siteConfigDraft.specialties.map((spec, i) => (
                      <div
                        key={spec.tone}
                        className="space-y-2 rounded-xl border border-white/10 bg-white/[0.03] p-3"
                      >
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            value={spec.title}
                            onChange={(e) => {
                              const next = [...siteConfigDraft.specialties];
                              next[i] = { ...next[i], title: e.target.value };
                              setSiteConfigDraft({ ...siteConfigDraft, specialties: next });
                            }}
                            placeholder="Tytuł"
                            className="rounded border border-white/15 bg-black/40 p-2 text-white"
                          />
                          <input
                            value={spec.price}
                            onChange={(e) => {
                              const next = [...siteConfigDraft.specialties];
                              next[i] = { ...next[i], price: e.target.value };
                              setSiteConfigDraft({ ...siteConfigDraft, specialties: next });
                            }}
                            placeholder="Cena np. od 200 zł"
                            className="rounded border border-white/15 bg-black/40 p-2 text-white"
                          />
                        </div>
                        <textarea
                          rows={2}
                          value={spec.blurb}
                          onChange={(e) => {
                            const next = [...siteConfigDraft.specialties];
                            next[i] = { ...next[i], blurb: e.target.value };
                            setSiteConfigDraft({ ...siteConfigDraft, specialties: next });
                          }}
                          className="w-full rounded border border-white/15 bg-black/40 p-2 text-white"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-3">
                    <button
                      type="button"
                      onClick={handleResetOverrides}
                      className="flex items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-red-300 hover:bg-red-500/20"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>Resetuj do domyślnych</span>
                    </button>

                    <button
                      type="button"
                      onClick={saveAllChanges}
                      disabled={saving}
                      className="flex items-center gap-2 rounded-xl bg-[#d4af37] px-5 py-2.5 font-semibold text-black hover:opacity-95"
                    >
                      <Save className="h-4 w-4" />
                      <span>{saving ? 'Zapisywanie...' : 'Zapisz zmiany w CMS'}</span>
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'services' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-zinc-400">
                      Edytuj ceny, nazwy oraz opisy zabiegów w cenniku i sklepie.
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        setEditingService({
                          id: `srv-${Date.now()}`,
                          slug: 'nowy-zabieg',
                          categorySlug: 'proktologia',
                          name: 'Nowa usługa medyczna',
                          priceGrosze: 30000,
                          durationMin: 30,
                          seoSummary: 'Krótki opis nowej usługi w klinice BM Clinics.',
                          fullDescription: 'Szczegółowy opis procedury i przygotowania pacjenta.',
                        })
                      }
                      className="flex items-center gap-1 rounded-lg bg-[#d4af37] px-3 py-1.5 font-semibold text-black"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Dodaj usługę</span>
                    </button>
                  </div>

                  {editingService && (
                    <form
                      onSubmit={handleSaveService}
                      className="space-y-3 rounded-xl border border-[#d4af37]/40 bg-white/[0.04] p-4"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-[#f4e7c3]">
                          Edycja usługi: {editingService.name}
                        </h4>
                        <button
                          type="button"
                          onClick={() => setEditingService(null)}
                          className="text-zinc-400 hover:text-white"
                        >
                          Anuluj
                        </button>
                      </div>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        <label className="space-y-1">
                          <span className="text-zinc-400">Nazwa usługi</span>
                          <input
                            required
                            value={editingService.name}
                            onChange={(e) =>
                              setEditingService({ ...editingService, name: e.target.value })
                            }
                            className="w-full rounded border border-white/15 bg-black/50 p-2 text-white"
                          />
                        </label>
                        <label className="space-y-1">
                          <span className="text-zinc-400">Slug URL</span>
                          <input
                            required
                            value={editingService.slug}
                            onChange={(e) =>
                              setEditingService({ ...editingService, slug: e.target.value })
                            }
                            className="w-full rounded border border-white/15 bg-black/50 p-2 text-white"
                          />
                        </label>
                        <label className="space-y-1">
                          <span className="text-zinc-400">Kategoria</span>
                          <select
                            value={editingService.categorySlug}
                            onChange={(e) =>
                              setEditingService({
                                ...editingService,
                                categorySlug: e.target.value,
                              })
                            }
                            className="w-full rounded border border-white/15 bg-black/50 p-2 text-white"
                          >
                            <option value="proktologia">Proktologia</option>
                            <option value="zylaki-naczynka">Żylaki i naczynka</option>
                            <option value="chirurgia-ogolna">Chirurgia ogólna</option>
                          </select>
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <label className="space-y-1">
                            <span className="text-zinc-400">Cena (zł)</span>
                            <input
                              type="number"
                              required
                              value={Math.round(editingService.priceGrosze / 100)}
                              onChange={(e) =>
                                setEditingService({
                                  ...editingService,
                                  priceGrosze: Number(e.target.value) * 100,
                                })
                              }
                              className="w-full rounded border border-white/15 bg-black/50 p-2 text-white"
                            />
                          </label>
                          <label className="space-y-1">
                            <span className="text-zinc-400">Czas (min)</span>
                            <input
                              type="number"
                              required
                              value={editingService.durationMin}
                              onChange={(e) =>
                                setEditingService({
                                  ...editingService,
                                  durationMin: Number(e.target.value),
                                })
                              }
                              className="w-full rounded border border-white/15 bg-black/50 p-2 text-white"
                            />
                          </label>
                        </div>
                      </div>
                      <label className="block space-y-1">
                        <span className="text-zinc-400">Krótki opis SEO</span>
                        <textarea
                          rows={2}
                          value={editingService.seoSummary}
                          onChange={(e) =>
                            setEditingService({ ...editingService, seoSummary: e.target.value })
                          }
                          className="w-full rounded border border-white/15 bg-black/50 p-2 text-white"
                        />
                      </label>
                      <label className="block space-y-1">
                        <span className="text-zinc-400">Pełny opis zabiegu</span>
                        <textarea
                          rows={3}
                          value={editingService.fullDescription}
                          onChange={(e) =>
                            setEditingService({
                              ...editingService,
                              fullDescription: e.target.value,
                            })
                          }
                          className="w-full rounded border border-white/15 bg-black/50 p-2 text-white"
                        />
                      </label>
                      <button
                        type="submit"
                        disabled={saving}
                        className="w-full rounded-lg bg-[#d4af37] py-2 font-semibold text-black"
                      >
                        {saving ? 'Zapisywanie...' : 'Zapisz usługę'}
                      </button>
                    </form>
                  )}

                  <div className="divide-y divide-white/10 rounded-xl border border-white/10 bg-white/[0.02]">
                    {(cmsState?.services ?? []).map((svc) => (
                      <div
                        key={svc.id}
                        className="flex items-center justify-between gap-3 px-3.5 py-2.5 hover:bg-white/[0.03]"
                      >
                        <div>
                          <p className="font-medium text-white">{svc.name}</p>
                          <p className="text-[11px] text-zinc-400">
                            {svc.categorySlug} • {(svc.priceGrosze / 100).toFixed(0)} zł •{' '}
                            {svc.durationMin} min
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingService(svc)}
                            className="rounded border border-white/15 px-2.5 py-1 text-[11px] text-zinc-200 hover:bg-white/10"
                          >
                            Edytuj
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteService(svc.id)}
                            className="rounded border border-red-500/30 p-1 text-red-400 hover:bg-red-500/10"
                            title="Usuń usługę"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'cli' && (
                <div className="space-y-4">
                  <div className="rounded-xl border border-white/10 bg-black/40 p-4">
                    <div className="flex items-center gap-2 text-[#d4af37]">
                      <Terminal className="h-4 w-4" />
                      <h4 className="font-semibold">BM Clinics CLI — Zarządzanie z Terminala</h4>
                    </div>
                    <p className="mt-1.5 text-zinc-300">
                      Projekt posiada dedykowane narzędzie CLI (<code>scripts/bmclinics-cli.mjs</code>),
                      które łączy się z API <code>/api/cms</code> online lub lokalnie:
                    </p>
                    <pre className="mt-3 overflow-x-auto rounded-lg bg-black/80 p-3 font-mono text-[11px] text-emerald-300">
{`# Pobranie statusu i listy usług online
npm run cli -- status
npm run cli -- services

# Zmiana telefonu lub tytułu strony z CLI
npm run cli -- set-config phone "+48 510 432 361"
npm run cli -- set-config standardTitle "Nowy nagłówek"

# Zmiana ceny usługi z CLI (w zł)
npm run cli -- set-price konsultacja-proktologiczna 280

# Wdrożenie na produkcję Vercel CLI
npx vercel --prod`}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
