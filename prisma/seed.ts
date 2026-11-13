import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type SeedService = {
  slug: string;
  categorySlug: string;
  name: string;
  priceGrosze: number;
  durationMin: number;
  seoSummary: string;
  fullDescription: string;
};

const services: SeedService[] = [
  // --- Proktologia ---
  {
    slug: 'konsultacja-proktologiczna',
    categorySlug: 'proktologia',
    name: 'Konsultacja proktologiczna',
    priceGrosze: 25000,
    durationMin: 30,
    seoSummary:
      'Konsultacja proktologiczna z badaniem i omówieniem planu leczenia – szybka diagnostyka dolegliwości odbytu i odbytnicy w komfortowych warunkach kliniki.',
    fullDescription:
      'Wizyta obejmuje wywiad, badanie oraz omówienie dalszej diagnostyki lub leczenia. Lekarz wyjaśnia przebieg ewentualnych zabiegów i przygotowanie do nich.',
  },
  {
    slug: 'anoskopia',
    categorySlug: 'proktologia',
    name: 'Anoskopia',
    priceGrosze: 35000,
    durationMin: 20,
    seoSummary:
      'Anoskopia to badanie końcowego odcinka kanału odbytu umożliwiające ocenę hemoroidów, szczelin i zmian zapalnych – wykonywane ambulatoryjnie, zwykle bez znieczulenia.',
    fullDescription:
      'Badanie wykonywane krótkim anoskopem pozwala ocenić kanał odbytu i dolną część odbytnicy. Trwa kilka–kilkanaście minut i najczęściej nie wymaga specjalnego przygotowania poza higieną miejscową.',
  },
  {
    slug: 'rektoskopia',
    categorySlug: 'proktologia',
    name: 'Rektoskopia',
    priceGrosze: 45000,
    durationMin: 30,
    seoSummary:
      'Rektoskopia pozwala ocenić odbytnicę i dolną część esicy – diagnostyka krwawień, polipów i zmian zapalnych w warunkach ambulatoryjnych kliniki.',
    fullDescription:
      'Badanie endoskopowe dolnego odcinka jelita grubego. Przed wizytą pacjent otrzymuje instrukcję przygotowania (oczyszczenie). Wynik i zalecenia omawiane są bezpośrednio po badaniu.',
  },
  {
    slug: 'leczenie-hemoroidow-ambulatoryjne',
    categorySlug: 'proktologia',
    name: 'Leczenie hemoroidów (metody ambulatoryjne)',
    priceGrosze: 80000,
    durationMin: 45,
    seoSummary:
      'Ambulatoryjne leczenie hemoroidów metodami małoinwazyjnymi – skrócony czas rekonwalescencji i indywidualny dobór techniki do stopnia zaawansowania choroby.',
    fullDescription:
      'Zabieg dobierany indywidualnie (m.in. ligacja, skleroterapia lub inne metody ambulatoryjne). Pacjent zwykle wraca do codziennych aktywności w ciągu 1–2 dni, zgodnie z zaleceniami lekarza.',
  },
  {
    slug: 'leczenie-szczeliny-odbytu',
    categorySlug: 'proktologia',
    name: 'Leczenie szczeliny odbytu',
    priceGrosze: 70000,
    durationMin: 40,
    seoSummary:
      'Leczenie szczeliny odbytu – od terapii zachowawczej po zabiegi ambulatoryjne – z naciskiem na złagodzenie bólu i bezpieczne gojenie w opiece specjalistycznej.',
    fullDescription:
      'Plan leczenia obejmuje ocenę przyczyny szczeliny, leczenie farmakologiczne lub zabiegowe oraz wskazówki dotyczące diety i higieny, które wspierają gojenie i zmniejszają ryzyko nawrotu.',
  },
  {
    slug: 'usuwanie-brodawek-okolicy-odbytu',
    categorySlug: 'proktologia',
    name: 'Usuwanie brodawek okolicy odbytu',
    priceGrosze: 60000,
    durationMin: 40,
    seoSummary:
      'Usuwanie brodawek okolicy odbytu w znieczuleniu miejscowym – precyzyjna procedura ambulatoryjna z instrukcją pielęgnacji po zabiegu i kontrolą gojenia.',
    fullDescription:
      'Zmiany usuwane są w znieczuleniu miejscowym. Po zabiegu pacjent otrzymuje zalecenia pielęgnacyjne i termin kontroli. Zakres i cena zależą od liczby oraz lokalizacji zmian.',
  },
  {
    slug: 'kontrola-po-zabiegu-proktologicznym',
    categorySlug: 'proktologia',
    name: 'Kontrola po zabiegu proktologicznym',
    priceGrosze: 20000,
    durationMin: 20,
    seoSummary:
      'Wizyta kontrolna po zabiegu proktologicznym – ocena gojenia, omówienie dolegliwości i dalszych zaleceń, aby bezpiecznie wrócić do codziennej aktywności.',
    fullDescription:
      'Lekarz ocenia przebieg gojenia, odpowiada na pytania dotyczące dolegliwości i ewentualnie modyfikuje zalecenia. Warto zabrać dokumentację z poprzedniej wizyty lub zabiegu.',
  },

  // --- Żylaki i naczynka ---
  {
    slug: 'konsultacja-fleboologiczna',
    categorySlug: 'zylaki-naczynka',
    name: 'Konsultacja flebologiczna',
    priceGrosze: 28000,
    durationMin: 30,
    seoSummary:
      'Konsultacja flebologiczna z oceną żylaków i teleangiektazji – omówienie diagnostyki USG oraz planu leczenia małoinwazyjnego dopasowanego do pacjenta.',
    fullDescription:
      'Wizyta obejmuje ocenę kliniczną kończyn, omówienie objawów i wskazanie dalszej diagnostyki (np. USG Doppler). Na jej podstawie ustalany jest plan leczenia zachowawczego lub zabiegowego.',
  },
  {
    slug: 'usg-doppler-zyl-konczyn',
    categorySlug: 'zylaki-naczynka',
    name: 'USG Doppler żył kończyn dolnych',
    priceGrosze: 35000,
    durationMin: 40,
    seoSummary:
      'USG Doppler żył kończyn dolnych ocenia drożność i wydolność zastawek – kluczowe badanie przed leczeniem żylaków i planowaniem skleroterapii lub laseroterapii.',
    fullDescription:
      'Badanie ultrasonograficzne z oceną przepływu w układzie żylnym. Wynik omawiany jest z pacjentem i służy do kwalifikacji do dalszego leczenia. Zalecane wygodne ubranie umożliwiające odsłonięcie nóg.',
  },
  {
    slug: 'zamykanie-naczynek-nog',
    categorySlug: 'zylaki-naczynka',
    name: 'Zamykanie naczynek na nogach',
    priceGrosze: 25000,
    durationMin: 30,
    seoSummary:
      'Zamykanie pękniętych naczynek na nogach laserem lub skleroterapią – zabieg ambulatoryjny, widoczna poprawa już po sesji, krótka rekonwalescencja.',
    fullDescription:
      'Zabieg polega na precyzyjnym zamknięciu widocznych naczynek laserem naczyniowym lub iniekcjami obliterującymi, dobieranymi do rodzaju i głębokości zmian. Często potrzebna jest seria zabiegów.',
  },
  {
    slug: 'zamykanie-naczynek-twarz',
    categorySlug: 'zylaki-naczynka',
    name: 'Zamykanie naczynek na twarzy',
    priceGrosze: 30000,
    durationMin: 30,
    seoSummary:
      'Laserowe zamykanie naczynek na twarzy – redukcja rumienia i teleangiektazji z krótkim czasem rekonwalescencji i indywidualnym doborem parametrów zabiegu.',
    fullDescription:
      'Procedura skierowana na widoczne naczynka i rumień. Przed zabiegiem oceniana jest fototyp skóry i przeciwwskazania. Po zabiegu zalecana jest ochrona przeciwsłoneczna i delikatna pielęgnacja.',
  },
  {
    slug: 'skleroterapia-zylakow',
    categorySlug: 'zylaki-naczynka',
    name: 'Skleroterapia żylaków',
    priceGrosze: 45000,
    durationMin: 45,
    seoSummary:
      'Skleroterapia żylaków to małoinwazyjne zamykanie niewydolnych żył iniekcją – ambulatoryjnie, zwykle bez hospitalizacji, z szybkim powrotem do aktywności.',
    fullDescription:
      'Do światła żylaka podawany jest środek obliterujący, który zamyka niewydolne naczynie. Po zabiegu często zalecane jest noszenie pończoch uciskowych zgodnie z indywidualnymi wskazaniami lekarza.',
  },
  {
    slug: 'laseroterapia-naczyniowa',
    categorySlug: 'zylaki-naczynka',
    name: 'Laseroterapia naczyniowa',
    priceGrosze: 40000,
    durationMin: 40,
    seoSummary:
      'Laseroterapia naczyniowa zamyka drobne naczynka i poprawia wygląd skóry – zabieg ambulatoryjny z doborem energii do lokalizacji zmian i typu skóry.',
    fullDescription:
      'Energia lasera jest absorbowana przez hemoglobinę w naczyniach, co prowadzi do ich zamknięcia. Liczba sesji zależy od rozległości zmian. Po zabiegu możliwy jest krótkotrwały rumień lub obrzęk.',
  },
  {
    slug: 'kontrola-po-zabiegu-naczyniowym',
    categorySlug: 'zylaki-naczynka',
    name: 'Kontrola po zabiegu naczyniowym',
    priceGrosze: 18000,
    durationMin: 20,
    seoSummary:
      'Kontrola po skleroterapii lub laseroterapii naczyniowej – ocena efektów, gojenia i decyzji o kolejnej sesji leczenia żylaków lub naczynek.',
    fullDescription:
      'Lekarz ocenia efekty dotychczasowego leczenia, odpowiada na pytania o dolegliwości i ustala, czy wskazana jest kolejna sesja lub zmiana zaleceń uciskowych i pielęgnacyjnych.',
  },

  // --- Chirurgia ogólna ---
  {
    slug: 'konsultacja-chirurgiczna',
    categorySlug: 'chirurgia-ogolna',
    name: 'Konsultacja chirurgiczna',
    priceGrosze: 27000,
    durationMin: 30,
    seoSummary:
      'Konsultacja z chirurgiem ogólnym – ocena wskazań do zabiegu, omówienie ryzyka i przygotowania oraz planu opieki przed- i pooperacyjnej w klinice.',
    fullDescription:
      'Wizyta obejmuje wywiad, badanie i omówienie dostępnych opcji leczenia. W razie potrzeby lekarz zleca badania dodatkowe i przedstawia zakres ewentualnego zabiegu oraz rekonwalescencji.',
  },
  {
    slug: 'usuwanie-znamion-chirurgiczne',
    categorySlug: 'chirurgia-ogolna',
    name: 'Chirurgiczne usuwanie znamion',
    priceGrosze: 50000,
    durationMin: 40,
    seoSummary:
      'Chirurgiczne usunięcie znamienia w znieczuleniu miejscowym – bezpieczna procedura ambulatoryjna z możliwością badania histopatologicznego usuniętej zmiany.',
    fullDescription:
      'Zmiana usuwana jest w znieczuleniu miejscowym z zachowaniem marginesów zgodnych ze wskazaniami klinicznymi. Materiał może być kierowany do badania histopatologicznego. Szwy zdejmowane są na wizycie kontrolnej.',
  },
  {
    slug: 'usuwanie-tluszczaka',
    categorySlug: 'chirurgia-ogolna',
    name: 'Usuwanie tłuszczaka',
    priceGrosze: 70000,
    durationMin: 45,
    seoSummary:
      'Usuwanie tłuszczaka w znieczuleniu miejscowym – ambulatoryjna procedura chirurgiczna z krótką rekonwalescencją i instrukcją pielęgnacji rany po zabiegu.',
    fullDescription:
      'Tłuszczak usuwany jest przez niewielkie nacięcie skóry. Czas zabiegu zależy od lokalizacji i wielkości zmiany. Pacjent otrzymuje zalecenia dotyczące opatrunków i ograniczeń aktywności.',
  },
  {
    slug: 'usuwanie-torbieli',
    categorySlug: 'chirurgia-ogolna',
    name: 'Usuwanie torbieli skórnych',
    priceGrosze: 65000,
    durationMin: 45,
    seoSummary:
      'Chirurgiczne usunięcie torbieli skórnych w warunkach ambulatoryjnych – znieczulenie miejscowe, kontrola gojenia i zalecenia zmniejszające ryzyko nawrotu.',
    fullDescription:
      'Zabieg polega na usunięciu torbieli wraz z torebką, o ile jest to możliwe technicznie. Po procedurze zakładany jest opatrunek, a pacjent otrzymuje termin kontroli i zasady pielęgnacji rany.',
  },
  {
    slug: 'leczenie-wrastajacego-paznokcia',
    categorySlug: 'chirurgia-ogolna',
    name: 'Leczenie wrastającego paznokcia',
    priceGrosze: 45000,
    durationMin: 35,
    seoSummary:
      'Leczenie wrastającego paznokcia metodą chirurgiczną ambulatoryjną – ulga w bólu, zmniejszenie stanu zapalnego i instrukcja dalszej pielęgnacji paznokcia.',
    fullDescription:
      'Zabieg wykonywany w znieczuleniu miejscowym. Zakres zależy od stopnia wrastania i stanu zapalnego. Po zabiegu ważna jest higiena, odpowiednie obuwie i wizyty kontrolne według zaleceń.',
  },
  {
    slug: 'drobne-zabiegi-chirurgiczne',
    categorySlug: 'chirurgia-ogolna',
    name: 'Drobne zabiegi chirurgiczne ambulatoryjne',
    priceGrosze: 55000,
    durationMin: 40,
    seoSummary:
      'Drobne zabiegi chirurgii ogólnej wykonywane ambulatoryjnie – indywidualna wycena po konsultacji, bezpieczne warunki i opieka pozabiegowa w klinice.',
    fullDescription:
      'Kategoria obejmuje wybrane procedury kwalifikowane do leczenia ambulatoryjnego. Ostateczny zakres, czas i cena ustalane są po konsultacji chirurgicznej oraz ocenie wskazań i przeciwwskazań.',
  },
  {
    slug: 'kontrola-po-zabiegu-chirurgicznym',
    categorySlug: 'chirurgia-ogolna',
    name: 'Kontrola po zabiegu chirurgicznym',
    priceGrosze: 18000,
    durationMin: 20,
    seoSummary:
      'Wizyta kontrolna po drobnym zabiegu chirurgicznym – ocena gojenia rany, zdjęcie szwów jeśli wskazane oraz omówienie dalszej aktywności i pielęgnacji.',
    fullDescription:
      'Lekarz ocenia ranę, w razie potrzeby zdejmuje szwy i aktualizuje zalecenia. Pacjent powinien zgłosić dolegliwości takie jak narastający ból, obrzęk, wyciek lub gorączka.',
  },
];

async function main() {
  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: {
        categorySlug: service.categorySlug,
        name: service.name,
        priceGrosze: service.priceGrosze,
        durationMin: service.durationMin,
        seoSummary: service.seoSummary,
        fullDescription: service.fullDescription,
      },
      create: service,
    });
  }

  console.log(`Seed OK: ${services.length} usług (upsert).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
