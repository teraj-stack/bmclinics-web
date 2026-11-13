import type { CSSProperties, ReactNode } from 'react';
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Ellipsis,
  FileText,
  LocateFixed,
  MessageCircle,
  Navigation,
  Phone,
  Plus,
  Star,
  User,
} from 'lucide-react';

const A = '/demo/cab-booking';

/** Copy from Figma text layers under Cover → 1 → Recent (47:808). */
const RECENT: { title: string; city: string; muted?: boolean }[] = [
  { title: '23, Gilmore Street', city: 'Montreal' },
  { title: 'Laronde', city: 'Montreal' },
  { title: 'Home', city: 'Montreal' },
  { title: '2323, Rene-Levesque Street', city: 'Montreal' },
  { title: '23, Gilmore Street', city: 'Montreal' },
  { title: '23, Gilmore Street', city: 'Montreal', muted: true },
];

const RIDES: {
  id: string;
  label: string;
  price: string;
  card: string;
  car: string;
  selected?: boolean;
}[] = [
  { id: 'compact', label: 'Compact', price: '$ 20.54', card: 'ride-card-compact.svg', car: 'car-compact.svg' },
  { id: 'family', label: 'Family', price: '$ 30.48', card: 'ride-card-family.svg', car: 'car-family.svg' },
  { id: 'premium', label: 'Premium', price: '$ 40.89', card: 'ride-card-premium.svg', car: 'car-premium.svg', selected: true },
];

function StatusBar({ light }: { light?: boolean }) {
  const fg = light ? 'text-white' : 'text-black';
  const signal = light ? `${A}/signal-light.svg` : `${A}/signal.svg`;
  const wifi = light ? `${A}/wifi-light.svg` : `${A}/wifi.svg`;
  const batO = light ? `${A}/battery-outline-light.svg` : `${A}/battery-outline.svg`;
  const batE = light ? `${A}/battery-end-light.svg` : `${A}/battery-end.svg`;
  const batF = light ? `${A}/battery-fill-light.svg` : `${A}/battery-fill.svg`;

  return (
    <div className="absolute left-0 top-0 z-40 flex h-[59px] w-full items-center px-1">
      <div className="flex w-[134px] items-center justify-center">
        <span
          className={`text-[17px] font-semibold tracking-[-0.41px] ${fg}`}
          style={{ fontFeatureSettings: '"case" 1' }}
        >
          9:41
        </span>
      </div>
      <div className="flex flex-1 justify-center pt-2.5">
        <div className="relative h-[37px] w-[125px] rounded-full bg-black">
          <span className="absolute left-1/2 top-1/2 h-[37px] w-20 -translate-x-[calc(50%+22.5px)] -translate-y-1/2 rounded-full bg-black" />
          <span className="absolute left-1/2 top-1/2 size-[37px] -translate-x-[calc(50%-44px)] -translate-y-1/2 rounded-full bg-black" />
        </div>
      </div>
      <div className="flex w-[134px] items-center justify-center gap-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={signal} alt="" width={18} height={12} className="h-3 w-[18px]" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={wifi} alt="" width={17} height={12} className="h-[12px] w-[17px]" />
        <span className="relative inline-block h-[13px] w-[27px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={batO} alt="" className="absolute left-[1px] top-0 h-[13px] w-[25px]" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={batE} alt="" className="absolute right-0 top-[4px] h-[4px] w-[1.4px]" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={batF} alt="" className="absolute left-[3px] top-[2px] h-[9px] w-[21px]" />
        </span>
      </div>
    </div>
  );
}

function SoftCircleButton({
  children,
  size = 44,
  className = '',
}: {
  children: ReactNode;
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <span
        className="absolute inset-[10%] rounded-full"
        style={{
          background: 'linear-gradient(145deg, #e8ebf8 0%, #c5cbe6 100%)',
          boxShadow:
            '8px 10px 18px rgba(90, 96, 140, 0.28), -4px -4px 10px rgba(255,255,255,0.65), inset 0 1px 0 rgba(255,255,255,0.7)',
        }}
      />
      <span className="relative z-10 flex items-center justify-center text-[#2b2d54]">{children}</span>
    </div>
  );
}

function GlassNavButton({ children }: { children: ReactNode }) {
  return (
    <div
      className="flex size-11 items-center justify-center rounded-[30px] text-white backdrop-blur-[15px]"
      style={{
        background: 'rgba(255,255,255,0.12)',
        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.25)',
      }}
    >
      {children}
    </div>
  );
}

function PhoneShell({
  children,
  className = '',
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={`absolute h-[844px] w-[390px] overflow-hidden rounded-[50px] shadow-[0px_60px_100px_0px_rgba(0,0,0,0.25)] ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}

function PhoneDestination() {
  return (
    <PhoneShell
      className="left-[301px] top-[81px]"
      style={{
        backgroundImage: 'linear-gradient(-47deg, rgb(177, 184, 222) 76%, rgb(192, 199, 233) 89%)',
      }}
    >
      {/* Light top plate with center notch (Figma Map/Base 47:756) — full opacity */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${A}/map-base.svg`}
        alt=""
        className="absolute left-0 top-[62px] z-10 h-[690px] w-full object-fill"
      />

      <StatusBar />

      {/* Plus sits in the notch */}
      <div className="absolute left-[161px] top-16 z-30 size-16">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${A}/plus-outer.svg`} alt="" className="absolute left-[5px] top-[5px] size-[54px]" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${A}/plus-inner.svg`} alt="" className="absolute left-2.5 top-2.5 size-11" />
        <Plus className="absolute left-1/2 top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 text-[#2b2d54]" strokeWidth={2.5} />
      </div>

      {/* Destination form */}
      <div className="absolute left-5 top-[152px] z-20 w-[350px]">
        <p className="text-[17px] font-extrabold text-black">Enter Your Destination</p>
        <div
          className="mt-[15px] flex h-[124px] flex-col items-center justify-center gap-4 rounded-[30px] border border-white/60 bg-[#dadef1] px-3 shadow-[0px_30px_30px_rgba(0,0,0,0.1)]"
        >
          <div className="flex w-full items-start gap-2">
            <div className="relative h-11 flex-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${A}/input-pill.svg`} alt="" className="absolute inset-0 size-full" />
              <div className="absolute left-0 top-0 flex size-11 items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${A}/icon-loc-outer.svg`} alt="" className="absolute size-10" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${A}/icon-loc-inner.svg`} alt="" className="absolute size-[34px]" />
                <Navigation className="relative size-3.5 fill-[#2b2d54] text-[#2b2d54]" />
              </div>
              <span className="absolute left-[52px] top-[13px] text-[15px] font-medium text-black/60">
                My Location
              </span>
            </div>
            <SoftCircleButton>
              <Ellipsis className="size-4" />
            </SoftCircleButton>
          </div>
          <div className="flex w-full items-start gap-2">
            <div className="relative h-11 flex-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${A}/input-pill.svg`} alt="" className="absolute inset-0 size-full" />
              <div className="absolute left-0 top-0 flex size-11 items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${A}/icon-loc-outer.svg`} alt="" className="absolute size-10" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${A}/icon-loc-inner.svg`} alt="" className="absolute size-[34px]" />
                <Navigation className="relative size-3.5 fill-[#2b2d54] text-[#2b2d54]" />
              </div>
              <span className="absolute left-[52px] top-[13px] text-[15px] font-medium text-black/60">
                Old Port of Montreal
              </span>
            </div>
            <SoftCircleButton>
              <ArrowUpDown className="size-4" />
            </SoftCircleButton>
          </div>
        </div>
      </div>

      {/* Recent sheet */}
      <div className="absolute bottom-0 left-0 z-20 h-[491px] w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${A}/recent-sheet.svg`} alt="" className="absolute inset-0 size-full" />
        <div className="relative px-5 pt-5">
          <p className="text-[17px] font-bold text-white">Recent</p>
          <ul className="mt-4 flex flex-col gap-4">
            {RECENT.map((row, i) => (
              <li key={`${row.title}-${i}`} className="flex flex-col gap-[13px]">
                <div className="flex items-center gap-4">
                  <div className="relative size-11 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`${A}/recent-icon-outer.svg`} alt="" className="absolute inset-0 size-full" />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`${A}/recent-icon-inner.svg`}
                      alt=""
                      className="absolute left-0.5 top-0.5 size-10"
                    />
                    <LocateFixed className="absolute left-1/2 top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 text-[#2b2d54]" />
                  </div>
                  <div className="flex flex-col text-[15px] leading-normal">
                    <span className={row.muted ? 'font-medium text-white' : 'font-bold text-white'}>
                      {row.title}
                    </span>
                    <span className="font-medium text-white/60">{row.city}</span>
                  </div>
                </div>
                <div className="h-px w-full bg-white/15" />
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Tab bar */}
      <div className="absolute bottom-0 left-0 z-30 h-[90px] w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${A}/tab-bar-1.svg`} alt="" className="absolute inset-0 size-full" />
        <User className="absolute left-[118px] top-[18px] size-6 fill-[#2b2d54] text-[#2b2d54]" />
        <FileText className="absolute right-[118px] top-[18px] size-6 fill-[#2b2d54] text-[#2b2d54]" />
        <span className="absolute bottom-2 left-1/2 h-[5px] w-[134px] -translate-x-1/2 rounded-full bg-[#383a69]" />
      </div>
    </PhoneShell>
  );
}

function PhoneChooseRide() {
  return (
    <PhoneShell
      className="left-[765px] top-[35px]"
      style={{
        backgroundImage: 'linear-gradient(99deg, rgb(38, 41, 76) 13%, rgb(47, 49, 91) 74%)',
      }}
    >
      {/* Dark map */}
      <div className="absolute left-0 top-[62px] h-[672px] w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${A}/map-dark.svg`} alt="" className="absolute inset-0 size-full object-cover" />
      </div>

      <StatusBar light />

      {/* Top nav */}
      <div className="absolute left-[30px] right-[30px] top-[59px] z-30 flex items-center justify-between">
        <GlassNavButton>
          <ChevronLeft className="size-5" />
        </GlassNavButton>
        <div className="relative size-[54px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${A}/plus-dark-outer.svg`} alt="" className="absolute inset-0 size-full" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${A}/plus-dark-inner.svg`} alt="" className="absolute left-[5px] top-[5px] size-11" />
          <Plus className="absolute left-1/2 top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 text-white" strokeWidth={2.5} />
        </div>
        <GlassNavButton>
          <User className="size-5 fill-white" />
        </GlassNavButton>
      </div>

      {/* Floating location chips */}
      <div
        className="absolute left-[56px] top-[142px] z-20 flex items-center rounded-[30px] border border-white/30 bg-white/10 shadow-[0px_30px_30px_rgba(0,0,0,0.25)] backdrop-blur-[5px]"
      >
        <span className="px-5 py-2.5 text-[13px] font-medium text-white">My Location</span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${A}/loc-icon.svg`} alt="" className="size-11" />
      </div>
      <div
        className="absolute left-[114px] top-[373px] z-20 flex items-center rounded-[30px] border border-white/30 bg-white/10 shadow-[0px_30px_30px_rgba(0,0,0,0.25)] backdrop-blur-[5px]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${A}/loc-icon-2.svg`} alt="" className="size-11" />
        <span className="px-5 py-2.5 text-[13px] font-medium text-white">Old Port of Montreal</span>
      </div>

      {/* Bottom sheet */}
      <div className="absolute bottom-0 left-0 z-20 h-[381px] w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${A}/sheet-light.svg`}
          alt=""
          className="absolute bottom-[61px] left-0 h-[320px] w-full"
        />
        <div className="absolute bottom-[61px] left-0 w-full px-5 pt-7">
          <span className="mx-auto mb-3 block h-[5px] w-10 rounded-full bg-white/60" />
          <p className="text-[17px] font-bold text-black">Choose a Ride</p>
          <div className="mt-4 flex gap-4">
            {RIDES.map((ride) => (
              <div
                key={ride.id}
                className={`relative h-[140px] w-[106px] ${ride.selected ? 'z-10 drop-shadow-[0_18px_28px_rgba(0,0,0,0.28)]' : ''}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${A}/${ride.card}`} alt="" className="absolute inset-0 size-full" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`${A}/${ride.car}`}
                  alt=""
                  className="absolute left-0 top-px h-20 w-[106px] object-contain"
                />
                <p className="absolute left-4 top-[86px] text-[15px] font-bold text-black">{ride.label}</p>
                <p className="absolute left-4 top-[108px] text-[13px] font-medium text-black/60">
                  {ride.price}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-3 flex h-11 items-center justify-between rounded-[10px] border border-white/60 bg-[#e0e2f0] px-2.5">
            <div className="flex items-center gap-1.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${A}/visa.svg`} alt="Visa" className="h-[15px] w-[30px]" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${A}/dots.svg`} alt="" className="h-[3px] w-[18px]" />
              <span className="text-[15px] font-bold text-black">4025</span>
            </div>
            <ChevronRight className="size-4 text-black/70" />
          </div>
        </div>

        {/* Book Now — light pill floating over dark footer (47:1230) */}
        <div className="absolute bottom-[28px] left-[62px] z-30 flex h-[50px] w-[255px] items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${A}/book-now-btn.svg`}
            alt=""
            className="pointer-events-none absolute left-1/2 top-1/2 h-[110px] w-[315px] max-w-none -translate-x-1/2 -translate-y-[42%]"
          />
          <span className="relative z-10 text-[15px] font-bold text-black">Book Now</span>
        </div>
      </div>

      <span className="absolute bottom-2 left-1/2 z-30 h-[5px] w-[134px] -translate-x-1/2 rounded-full bg-white/60" />
    </PhoneShell>
  );
}

function PhoneDriver() {
  return (
    <PhoneShell
      className="left-[1229px] top-[81px] shadow-[0px_30px_100px_0px_rgba(0,0,0,0.25)]"
      style={{
        backgroundImage: 'linear-gradient(-2deg, rgb(206, 210, 233) 84%, rgb(196, 201, 230) 99%)',
      }}
    >
      {/* Light map */}
      <div className="absolute left-0 top-[59px] h-[693px] w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${A}/map-light.svg`} alt="" className="absolute inset-0 size-full object-cover" />
      </div>

      <StatusBar />

      {/* Top nav */}
      <div className="absolute left-[30px] right-[30px] top-[59px] z-30 flex items-center justify-between">
        <div
          className="flex size-11 items-center justify-center rounded-[30px] text-[#2b2d54] backdrop-blur-[15px]"
          style={{
            background: 'rgba(255,255,255,0.35)',
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.5)',
          }}
        >
          <ChevronLeft className="size-5" />
        </div>
        <div className="relative size-16">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${A}/plus-s3-outer.svg`} alt="" className="absolute left-[5px] top-[5px] size-[54px]" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${A}/plus-inner.svg`} alt="" className="absolute left-2.5 top-2.5 size-11" />
          <Plus className="absolute left-1/2 top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 text-[#2b2d54]" strokeWidth={2.5} />
        </div>
        <div
          className="flex size-11 items-center justify-center rounded-[30px] text-[#2b2d54] backdrop-blur-[15px]"
          style={{
            background: 'rgba(255,255,255,0.35)',
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.5)',
          }}
        >
          <User className="size-5" />
        </div>
      </div>

      {/* Car on map */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${A}/car-audi-side.png`}
        alt=""
        className="absolute left-[154px] top-[238px] w-[60px] rotate-[56deg] object-cover"
      />

      {/* ETA chip */}
      <div
        className="absolute left-[74px] top-[333px] z-20 flex items-center justify-center rounded-[20px] border border-black/10 px-5 py-2.5 shadow-[0px_30px_30px_rgba(184,189,219,0.6)]"
        style={{ background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(10px)' }}
      >
        <span className="text-[15px] font-medium text-black">Your driver arrives in 3 min</span>
      </div>

      {/* Driver sheet */}
      <div className="absolute bottom-0 left-0 z-20 h-[328px] w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${A}/driver-sheet.svg`}
          alt=""
          className="absolute bottom-0 left-0 h-[307px] w-full"
        />

        {/* Avatar */}
        <div className="absolute left-[156px] top-0 size-[86px]">
          <span className="absolute inset-0 rounded-full bg-white shadow-[0_8px_24px_rgba(0,0,0,0.25)]" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${A}/driver-avatar.png`}
            alt="Alex Gondron"
            className="absolute left-[5px] top-[5px] size-[76px] rounded-full object-cover"
          />
        </div>

        <div className="absolute left-0 right-0 top-[110px] flex flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-bold text-white">Alex Gondron</span>
              <span className="size-1 rounded-full bg-white/50" />
              <Star className="size-3.5 fill-[#FFCC00] text-[#FFCC00]" />
              <span className="text-[15px] font-medium text-white">5.0</span>
            </div>
            <div className="flex items-center gap-2 text-[15px] font-medium text-white/60">
              <span>Audi TT</span>
              <span className="size-1 rounded-full bg-white/40" />
              <span>YH1S44T</span>
            </div>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${A}/car-audi.png`}
            alt="Audi TT"
            className="h-[89px] w-[167px] object-contain object-center"
          />
        </div>
      </div>

      {/* Tab bar phone / message */}
      <div className="absolute bottom-0 left-0 z-30 h-[90px] w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${A}/tab-bar-3.svg`} alt="" className="absolute inset-0 size-full" />
        <Phone className="absolute left-[118px] top-[18px] size-6 fill-white text-white" />
        <MessageCircle className="absolute right-[118px] top-[18px] size-6 fill-white text-white" />
        <span className="absolute bottom-2 left-1/2 h-[5px] w-[134px] -translate-x-1/2 rounded-full bg-white/60" />
      </div>
    </PhoneShell>
  );
}

export default function CabBookingCover() {
  return (
    <div className="cab-booking-root flex min-h-screen w-full items-start justify-center overflow-x-auto bg-[#a0a2cb] px-4 py-8">
      <style>{`
        .cab-booking-root {
          --cab-scale: min(1, calc((100vw - 32px) / 1920));
        }
        .cab-booking-frame {
          width: calc(1920px * var(--cab-scale));
          height: calc(960px * var(--cab-scale));
        }
        .cab-booking-stage {
          width: 1920px;
          height: 960px;
          transform: scale(var(--cab-scale));
          transform-origin: top left;
        }
      `}</style>
      <div className="cab-booking-frame relative shrink-0">
        <div className="cab-booking-stage relative bg-[#a0a2cb]">
          <PhoneDestination />
          <PhoneChooseRide />
          <PhoneDriver />
        </div>
      </div>
    </div>
  );
}
