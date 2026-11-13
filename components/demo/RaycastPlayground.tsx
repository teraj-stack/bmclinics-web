import Image from 'next/image';

const ASSETS = {
  codeExample: '/demo/raycast/code-example.png',
  commandPalette: '/demo/raycast/command-palette.png',
  arrowRight: '/demo/raycast/arrow-right.svg',
  iconHammer: '/demo/raycast/icon-hammer.svg',
  iconBook: '/demo/raycast/icon-book.svg',
  iconSmiley: '/demo/raycast/icon-smiley.svg',
  timelineNode: '/demo/raycast/timeline-node.svg',
} as const;

const TIMELINE = [
  { label: 'Remon added a feature request', width: 243.52 },
  { label: 'Imthath reported a bug', width: 191.02 },
  { label: 'Artem reported a bug', width: 176.02 },
  { label: 'Petr reported a bug', width: 168.52 },
] as const;

function GlassIcon({ src, alt, strong }: { src: string; alt: string; strong?: boolean }) {
  return (
    <div
      className="relative flex size-16 shrink-0 items-center justify-center rounded-2xl"
      style={{
        background: strong
          ? 'linear-gradient(90deg, rgba(255,255,255,0.2), rgba(255,255,255,0.2))'
          : 'linear-gradient(90deg, rgba(255,255,255,0.1), rgba(255,255,255,0.1))',
        boxShadow: strong
          ? 'inset 0 0 0 1px rgba(255,255,255,0.18)'
          : 'inset 0 0 0 1px rgba(255,255,255,0.12)',
      }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          background:
            'radial-gradient(circle at 50% 35%, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0) 70%)',
        }}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} width={32} height={32} className="relative size-8" />
    </div>
  );
}

function Timeline() {
  return (
    <ul className="relative flex flex-col gap-11 pl-0">
      {TIMELINE.map((item, index) => (
        <li key={item.label} className="relative flex items-center gap-[15px]">
          {index < TIMELINE.length - 1 ? (
            <span
              aria-hidden
              className="absolute left-[7px] top-[22px] h-11 w-0.5 border-l-2 border-dashed border-white/20"
            />
          ) : (
            <span
              aria-hidden
              className="absolute left-[7px] top-[22px] h-11 w-0.5 border-l-2 border-dashed border-white/20"
            />
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={ASSETS.timelineNode}
            alt=""
            width={16}
            height={16}
            className="relative z-10 size-4 shrink-0"
          />
          <div
            className="flex h-[30px] items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-3"
            style={{ width: item.width }}
          >
            <span
              className="text-center text-xs tracking-[0.3px] text-white/80"
              style={{ fontFamily: 'var(--font-raycast-mono), ui-monospace, monospace' }}
            >
              {item.label}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function RaycastPlayground() {
  return (
    <section
      className="mx-auto w-full max-w-[1262px] px-8"
      style={{ fontFamily: 'var(--font-raycast-sans), Inter, system-ui, sans-serif' }}
      data-node-id="3003:275"
    >
      {/* Hero: Build what you've always wanted */}
      <div
        className="relative overflow-hidden rounded-xl"
        style={{
          minHeight: 676,
          backgroundImage:
            'linear-gradient(107.56deg, rgb(220, 249, 255) 0%, rgb(98, 29, 186) 48.44%, rgb(4, 0, 28) 95.31%)',
        }}
        data-node-id="3003:279"
      >
        <div className="relative flex min-h-[676px] flex-col lg:block">
          {/* Visual: code + command palette — desktop absolute to match Figma */}
          <div
            className="relative mx-auto mt-10 h-[320px] w-full max-w-[720px] shrink-0 overflow-visible sm:h-[379px] lg:absolute lg:inset-y-8 lg:left-[-110px] lg:right-[622px] lg:mx-0 lg:mt-0 lg:h-auto lg:max-w-none"
            data-node-id="3003:292"
          >
            <div className="absolute left-0 top-[-39px] h-[556px] w-[min(782px,100%)]">
              <Image
                src={ASSETS.codeExample}
                alt="Raycast Actions code example"
                width={782}
                height={556}
                className="h-full w-full object-cover object-left-top"
                priority
              />
            </div>
            <div className="absolute left-[38%] top-[25px] h-[300px] w-[55%] max-w-[416px] sm:left-[430px] sm:h-[370px] sm:w-[416px]">
              <Image
                src={ASSETS.commandPalette}
                alt="Raycast command palette"
                width={416}
                height={370}
                className="h-full w-full object-contain object-left-top drop-shadow-2xl"
                priority
              />
            </div>
          </div>

          {/* Copy — Figma: inset 136.5 / 64 / 136.5 / 800 */}
          <div
            className="relative z-10 mx-auto max-w-[352px] px-8 pb-16 pt-6 lg:absolute lg:inset-y-[136.5px] lg:right-16 lg:left-[800px] lg:mx-0 lg:max-w-none lg:px-0 lg:py-0"
            data-node-id="3003:280"
          >
            <GlassIcon src={ASSETS.iconHammer} alt="" strong />
            <h2 className="mt-8 text-[20px] font-semibold leading-[27px] text-white">
              Build what you’ve always wanted
            </h2>
            <div className="mt-6 space-y-6 text-base leading-6 tracking-[0.3px] text-white/80">
              <p>
                Start building your perfect tools with the Raycast API, and streamline your
                workflows. Simply create Extensions with ease and publish directly to the Raycast
                Store seamlessly.
              </p>
              <p>
                Get started with the integrated developer tools in Raycast and build your first
                extension in no time.
              </p>
            </div>
            <a
              href="https://developers.raycast.com/"
              className="mt-8 inline-flex h-10 items-center rounded-lg bg-black/30 px-5 text-sm font-medium tracking-[0.2px] text-white transition hover:bg-black/40"
            >
              Learn more
            </a>
          </div>
        </div>
      </div>

      {/* Bottom cards */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1.35fr_0.9fr]">
        {/* Open source community */}
        <div
          className="relative min-h-[355px] overflow-hidden rounded-xl bg-white/10"
          data-node-id="3003:301"
        >
          <div className="grid h-full min-h-[355px] grid-cols-1 lg:grid-cols-[1fr_0.85fr]">
            <div className="px-16 py-16">
              <GlassIcon src={ASSETS.iconSmiley} alt="" />
              <h3 className="mt-8 text-[20px] font-semibold leading-[27px] text-white">
                Open source community
              </h3>
              <p className="mt-6 max-w-[344px] text-base leading-6 tracking-[0.3px] text-white/80">
                Build in the open and collaborate with other Developers on yours and their
                Extensions. Contribute as you’d like, and help others by building on top of existing
                Extensions.
              </p>
            </div>
            <div
              className="relative hidden items-center pl-2 pr-6 lg:flex"
              style={{
                maskImage: 'linear-gradient(90deg, transparent 0%, black 12%, black 78%, transparent 100%)',
                WebkitMaskImage:
                  'linear-gradient(90deg, transparent 0%, black 12%, black 78%, transparent 100%)',
              }}
            >
              <Timeline />
            </div>
          </div>
        </div>

        {/* Be part of the story */}
        <div className="min-h-[355px] rounded-xl bg-white/10 px-16 py-16" data-node-id="3003:295">
          <GlassIcon src={ASSETS.iconBook} alt="" />
          <h3 className="mt-8 text-[20px] font-semibold leading-[27px] text-white">
            Be part of the story
          </h3>
          <p className="mt-6 max-w-[342px] text-base leading-6 tracking-[0.3px] text-white/80">
            We listen to our community and build Raycast in collaboration with developers, to build
            the best product and developer experience across the platform.
          </p>
        </div>
      </div>

      {/* Explore the docs */}
      <div className="mt-10 flex items-center justify-center gap-1.5 pb-2">
        <a
          href="https://developers.raycast.com/"
          className="inline-flex items-center gap-1.5 text-base font-medium tracking-[0.3px] text-white transition hover:text-white/80"
        >
          Explore the docs
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={ASSETS.arrowRight} alt="" width={16} height={16} className="size-4" />
        </a>
      </div>
    </section>
  );
}
