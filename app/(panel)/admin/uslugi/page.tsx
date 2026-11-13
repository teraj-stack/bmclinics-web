import { getServicesCatalog } from '@/lib/servicesCatalog';
import { createService, deleteService } from './actions';

export const dynamic = 'force-dynamic';

export default async function AdminServicesPage() {
  const services = await getServicesCatalog();

  return (
    <div className="space-y-8">
      <h1 className="text-xl font-semibold">Usługi ({services.length})</h1>

      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b" style={{ borderColor: 'var(--border-color)' }}>
            <th className="py-2">Nazwa</th>
            <th>Kategoria</th>
            <th>Cena</th>
            <th>Czas</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {services.map((s) => (
            <tr key={s.id} className="border-b" style={{ borderColor: 'var(--border-color)' }}>
              <td className="py-2">{s.name}</td>
              <td>{s.categorySlug}</td>
              <td>{(s.priceGrosze / 100).toFixed(2)} zł</td>
              <td>{s.durationMin} min</td>
              <td>
                <form action={deleteService.bind(null, s.id)}>
                  <button className="text-red-600" type="submit">
                    Usuń
                  </button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <details className="glass-card p-4">
        <summary className="cursor-pointer font-medium">Dodaj nową usługę</summary>
        <form action={createService} className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input name="name" placeholder="Nazwa" required className="rounded border p-2" style={{ borderColor: 'var(--border-color)' }} />
          <input name="slug" placeholder="slug (np. zamykanie-naczynek-nog)" required className="rounded border p-2" style={{ borderColor: 'var(--border-color)' }} />
          <select name="categorySlug" required className="rounded border p-2" style={{ borderColor: 'var(--border-color)' }}>
            <option value="proktologia">Proktologia</option>
            <option value="zylaki-naczynka">Żylaki i naczynka</option>
            <option value="chirurgia-ogolna">Chirurgia ogólna</option>
          </select>
          <input name="priceGrosze" type="number" placeholder="Cena w groszach" required className="rounded border p-2" style={{ borderColor: 'var(--border-color)' }} />
          <input name="durationMin" type="number" placeholder="Czas trwania (min)" required className="rounded border p-2" style={{ borderColor: 'var(--border-color)' }} />
          <textarea name="seoSummary" placeholder="Opis SEO (do 35 słów)" required className="rounded border p-2 sm:col-span-2" style={{ borderColor: 'var(--border-color)' }} />
          <textarea name="fullDescription" placeholder="Pełny opis" required className="rounded border p-2 sm:col-span-2" style={{ borderColor: 'var(--border-color)' }} />
          <button type="submit" className="rounded bg-[var(--text-primary)] px-4 py-2 text-[var(--bg-primary)] sm:col-span-2">
            Zapisz usługę
          </button>
        </form>
      </details>
    </div>
  );
}
