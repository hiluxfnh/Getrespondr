import {
  ArrowRight,
  Bell,
  MapPinned,
  ShieldAlert,
  ShieldCheck,
  Siren,
  Workflow,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

const stats = [
  {
    value: "1,248+",
    label: "Active Incidents",
  },
  {
    value: "5,432+",
    label: "Volunteers Online",
  },
  {
    value: "812",
    label: "Resources Deployed",
  },
  {
    value: "24/7",
    label: "System Monitoring",
  },
];

const mapPoints = [
  {
    top: "28%",
    left: "34%",
    tone: "amber",
    size: 24,
    glow: "rgba(251, 191, 36, 0.36)",
    core: "#f59e0b",
    animation: "2.2s",
  },
  {
    top: "42%",
    left: "58%",
    tone: "red",
    size: 20,
    glow: "rgba(248, 113, 113, 0.34)",
    core: "#ef4444",
    animation: "2.6s",
  },
  {
    top: "52%",
    left: "47%",
    tone: "red",
    size: 16,
    glow: "rgba(248, 113, 113, 0.3)",
    core: "#ef4444",
    animation: "2.1s",
  },
];

const featurePills = [
  {
    icon: Siren,
    label: "Incident routing",
  },
  {
    icon: MapPinned,
    label: "Live map tracking",
  },
  {
    icon: Workflow,
    label: "Response coordination",
  },
];

function RoadNetwork() {
  return (
    <svg
      viewBox="0 0 800 600"
      className="absolute inset-0 h-full w-full opacity-70"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="roadGlow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ffb25b" stopOpacity="0.18" />
          <stop offset="50%" stopColor="#ff8a1f" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#ffb25b" stopOpacity="0.18" />
        </linearGradient>
      </defs>

      <g fill="none" stroke="url(#roadGlow)" strokeWidth="2">
        <path d="M80 140 C160 90, 210 110, 280 160 S430 240, 520 185 S650 130, 720 170" />
        <path d="M80 320 C150 280, 240 300, 310 250 S430 160, 510 210 S640 300, 720 250" />
        <path d="M120 520 C210 450, 270 420, 360 440 S510 520, 600 460 S680 390, 760 420" />
        <path d="M180 70 C220 150, 260 210, 310 280 S430 420, 500 520" />
        <path d="M620 60 C610 140, 590 210, 565 280 S520 420, 480 520" />
      </g>

      <g fill="none" stroke="#2b4f87" strokeOpacity="0.5" strokeWidth="1.5">
        <path d="M0 210 L800 210" />
        <path d="M0 370 L800 370" />
        <path d="M220 0 L220 600" />
        <path d="M420 0 L420 600" />
        <path d="M610 0 L610 600" />
      </g>

      <g fill="#214375" fillOpacity="0.6">
        <circle cx="170" cy="160" r="6" />
        <circle cx="260" cy="255" r="5" />
        <circle cx="410" cy="200" r="7" />
        <circle cx="530" cy="320" r="6" />
        <circle cx="650" cy="220" r="5" />
        <circle cx="590" cy="470" r="6" />
      </g>
    </svg>
  );
}

export default function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#071d40] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(66,123,219,0.22),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(255,152,57,0.12),transparent_18%),linear-gradient(180deg,#0a234b_0%,#071d40_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:72px_72px] opacity-30" />

      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
        <Link to="/" className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/5 shadow-lg shadow-black/20 backdrop-blur-sm">
            <ShieldCheck className="h-6 w-6 text-sky-300" />
          </div>
          <span className="text-xl font-semibold tracking-tight">GetRespondr</span>
        </Link>

        <nav className="hidden items-center gap-10 text-sm font-medium text-white/75 md:flex">
          <a href="#features" className="transition hover:text-white">Features</a>
          <a href="#how-it-works" className="transition hover:text-white">How It Works</a>
          <a href="#about" className="transition hover:text-white">About Us</a>
          <a href="#contact" className="transition hover:text-white">Contact</a>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="rounded-xl border border-white/25 bg-white/5 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
          >
            Login
          </Link>
          <Link
            to="/live-map"
            className="rounded-xl bg-[#ff8a1f] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-950/30 transition hover:bg-[#ff9b3d]"
          >
            Get Started
          </Link>
        </div>
      </header>

      <section className="relative z-10 mx-auto grid max-w-7xl gap-16 px-6 pb-10 pt-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-10 lg:pt-14">
        <div className="max-w-2xl pt-10 lg:pt-16">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/65 backdrop-blur-sm">
            Real-time response platform
          </p>

          <h1 className="max-w-xl text-5xl font-semibold leading-[0.98] tracking-tight text-white sm:text-6xl lg:text-[4.2rem]">
            Real-Time
            <br />
            Crisis Coordination.
            <br />
            Stronger Together.
          </h1>

          <p className="mt-8 max-w-lg text-lg leading-8 text-white/75 sm:text-xl">
            GetRespondr helps communities, volunteers, and organizations respond faster,
            coordinate better, and save more lives.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              to="/incidents"
              className="inline-flex items-center gap-2 rounded-2xl bg-[#ff8a1f] px-6 py-4 text-base font-semibold text-white shadow-[0_18px_40px_rgba(255,138,31,0.28)] transition hover:-translate-y-0.5 hover:bg-[#ff9b3d]"
            >
              Report Incident
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              to="/live-map"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/40 bg-transparent px-6 py-4 text-base font-semibold text-white transition hover:border-white/65 hover:bg-white/5"
            >
              View Live Map
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap gap-3 text-sm text-white/70">
            {featurePills.map((pill) => {
              const Icon = pill.icon;

              return (
                <div
                  key={pill.label}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm"
                >
                  <Icon className="h-4 w-4 text-orange-300" />
                  <span>{pill.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative min-h-[560px] rounded-[32px] border border-white/10 bg-white/5 p-4 shadow-[0_30px_80px_rgba(2,10,28,0.55)] backdrop-blur-sm">
          <div className="absolute inset-4 rounded-[28px] bg-[radial-gradient(circle_at_center,rgba(46,104,196,0.38),transparent_38%),radial-gradient(circle_at_20%_20%,rgba(255,166,60,0.18),transparent_16%),radial-gradient(circle_at_65%_55%,rgba(255,91,72,0.24),transparent_17%),linear-gradient(180deg,#0d2a57_0%,#081d3f_100%)]" />

          <div className="absolute inset-4 rounded-[28px] overflow-hidden border border-white/5">
            <RoadNetwork />

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(10,36,82,0.12),transparent_28%)]" />

            {mapPoints.map((point, index) => (
              <div
                key={index}
                className="absolute"
                style={{ top: point.top, left: point.left }}
              >
                <div className="relative">
                  <div
                    className="absolute rounded-full blur-xl"
                    style={{
                      inset: `-${Math.round(point.size / 3)}px`,
                      width: point.size,
                      height: point.size,
                      backgroundColor: point.glow,
                      animation: `mapTwinkle ${point.animation} ease-in-out infinite`,
                    }}
                  />

                  <div
                    className="relative rounded-full shadow-[0_0_0_8px_rgba(255,138,31,0.08)]"
                    style={{
                      width: point.size,
                      height: point.size,
                      backgroundColor: point.core,
                      animation: `mapTwinkle ${point.animation} ease-in-out infinite`,
                    }}
                  />
                  <div className="absolute -bottom-1 left-1/2 h-5 w-0.5 -translate-x-1/2 bg-white/40" />
                </div>
              </div>
            ))}

            <div className="absolute left-[28%] top-[46%] grid h-24 w-24 place-items-center rounded-full bg-orange-400/15">
              <div className="absolute h-full w-full rounded-full bg-orange-400/20 animate-ping" />
              <div className="absolute h-16 w-16 rounded-full bg-orange-400/25 animate-ping [animation-delay:200ms]" />
              <div className="relative grid h-12 w-12 place-items-center rounded-full bg-[#ff8a1f] text-white shadow-[0_0_40px_rgba(255,138,31,0.55)]">
                <Siren className="h-6 w-6" />
              </div>
            </div>

            <div className="absolute bottom-8 left-6 right-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/10 bg-[#0d264d]/95 px-5 py-4 shadow-lg shadow-black/15"
                >
                  <p className="text-2xl font-semibold tracking-tight text-white sm:text-[2rem]">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm text-white/68">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="absolute right-5 top-5 grid gap-3">
              <div className="rounded-2xl border border-white/10 bg-[#0b2146]/90 px-4 py-3 text-sm text-white/80 shadow-lg">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-orange-300" />
                  <span>3 alerts today</span>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#0b2146]/90 px-4 py-3 text-sm text-white/80 shadow-lg">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-red-300" />
                  <span>Response time improving</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="relative z-10 mx-auto max-w-7xl px-6 pb-6 lg:px-10">
        <div className="grid gap-4 rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur-sm lg:grid-cols-3">
          {[
            {
              title: "Live coordination",
              text: "Track incidents, volunteers, and resources in one shared view.",
            },
            {
              title: "Clear escalation",
              text: "Separate low, medium, high, and critical events with visual priority.",
            },
            {
              title: "Fast response",
              text: "Move from alert to action with maps, filters, and dispatch-ready teams.",
            },
          ].map((item) => (
            <article key={item.title} className="rounded-2xl border border-white/10 bg-[#0b2146]/80 p-5">
              <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-white/70">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="relative z-10 mx-auto max-w-7xl px-6 py-8 lg:px-10">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <h2 className="text-2xl font-semibold text-white">How it works</h2>
            <p className="mt-3 max-w-xl text-white/70">
              Report incidents, view the live map, and coordinate teams from the same workflow. The interface is built to keep the focus on what needs action now.
            </p>
          </div>

          <div id="about" className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <h2 className="text-2xl font-semibold text-white">About Us</h2>
            <p className="mt-3 max-w-xl text-white/70">
              GetRespondr is a crisis coordination concept designed for clarity, speed, and high-contrast visibility in stressful moments.
            </p>
          </div>
        </div>
      </section>

      <section id="contact" className="relative z-10 mx-auto max-w-7xl px-6 pb-12 lg:px-10">
        <div className="rounded-[28px] border border-white/10 bg-[#0b2146]/85 px-6 py-5 text-white/80 backdrop-blur-sm">
          Contact: coordination@getrespondr.local
        </div>
      </section>
    </main>
  );
}