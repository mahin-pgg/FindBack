import React, { useState } from "react";
import { Link } from "react-router";
import FloatingLines from "../../components/floatingLines/FloatingLines.jsx";

const MobileMenu = ({ menuOpen, setMenuOpen }) => {
  if (!menuOpen) return null;

  return (
    <div className="absolute top-20 left-4 right-4 z-50 rounded-2xl border border-white/10 bg-slate-950/90 p-5 shadow-2xl backdrop-blur-xl md:hidden">
      <div className="flex flex-col gap-4">
        <Link
          to="/"
          onClick={() => setMenuOpen(false)}
          className="rounded-xl px-4 py-3 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
        >
          Home
        </Link>

        <Link
          to="/about"
          onClick={() => setMenuOpen(false)}
          className="rounded-xl px-4 py-3 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
        >
          About
        </Link>

        <Link
          to="/contact"
          onClick={() => setMenuOpen(false)}
          className="rounded-xl px-4 py-3 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
        >
          Contact
        </Link>

        <div className="my-1 h-px bg-white/10" />

        <Link
          to="/login"
          onClick={() => setMenuOpen(false)}
          className="rounded-xl px-4 py-3 text-center text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
        >
          Log in
        </Link>

        <Link
          to="/signup"
          onClick={() => setMenuOpen(false)}
          className="rounded-xl bg-white px-4 py-3 text-center text-sm font-semibold text-slate-950 transition hover:bg-white/90"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
};

const Home = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const features = [
    {
      icon: "✦",
      title: "AI-Powered Matching",
      description:
        "Our intelligent matching system compares item details and images to discover potential matches.",
    },
    {
      icon: "✓",
      title: "Verified Recovery",
      description:
        "Campus admins review reports and claims to keep the recovery process safe and trustworthy.",
    },
    {
      icon: "⌁",
      title: "Simple & Secure",
      description:
        "A streamlined campus experience designed to help you report, discover, and recover items.",
    },
  ];

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#050816] text-white">
      {/* =========================================================
          BACKGROUND
      ========================================================= */}

      <div className="absolute inset-0 z-0">
        {/* Base gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 0%, rgba(99,102,241,0.28), transparent 35%), linear-gradient(135deg, #050816 0%, #0b1028 45%, #17103b 100%)",
          }}
        />

        {/* Floating lines */}
        <div className="absolute inset-0 opacity-70">
          <FloatingLines
            enabledWaves={["top", "middle", "bottom"]}
            lineCount={8}
            lineDistance={8}
            bendRadius={8}
            bendStrength={-2}
            interactive
            parallax={true}
            animationSpeed={1}
            gradientStart="#8b5cf6"
            gradientMid="#6366f1"
            gradientEnd="#c4b5fd"
          />
        </div>

        {/* Atmospheric glow */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 35%, rgba(79,70,229,0.18) 0%, transparent 55%)",
          }}
        />

        {/* Bottom fade */}
        <div
          className="absolute inset-x-0 bottom-0 h-72"
          style={{
            background:
              "linear-gradient(to top, rgba(5,8,22,0.95), transparent)",
          }}
        />
      </div>

      {/* =========================================================
          CONTENT
      ========================================================= */}

      <div className="relative z-10 min-h-screen">
        {/* =====================================================
            NAVBAR
        ===================================================== */}

        <header className="mx-auto w-full max-w-7xl px-5 pt-5 sm:px-8 lg:px-10">
          <nav className="flex h-16 items-center justify-between rounded-2xl border border-white/10 bg-white/[0.06] px-4 shadow-2xl shadow-black/10 backdrop-blur-xl sm:px-6">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-xl shadow-lg">
                🎒
              </div>

              <div>
                <div className="text-base font-bold tracking-tight">
                  FindBack
                </div>
                <div className="hidden text-[10px] font-medium uppercase tracking-[0.2em] text-white/40 sm:block">
                  Campus Recovery
                </div>
              </div>
            </Link>

            {/* Desktop navigation */}
            <div className="hidden items-center gap-8 md:flex">
              <Link
                to="/"
                className="text-sm font-medium text-white transition"
              >
                Home
              </Link>

              <Link
                to="/about"
                className="text-sm font-medium text-white/55 transition hover:text-white"
              >
                About
              </Link>

              <Link
                to="/contact"
                className="text-sm font-medium text-white/55 transition hover:text-white"
              >
                Contact
              </Link>
            </div>

            {/* Desktop actions */}
            <div className="hidden items-center gap-3 md:flex">
              <Link
                to="/login"
                className="rounded-xl px-4 py-2.5 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                Log in
              </Link>

              <Link
                to="/signup"
                className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-white/10 transition hover:-translate-y-0.5 hover:bg-white/90"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-lg md:hidden"
              aria-label="Toggle menu"
            >
              {menuOpen ? "×" : "☰"}
            </button>
          </nav>

          <MobileMenu
            menuOpen={menuOpen}
            setMenuOpen={setMenuOpen}
          />
        </header>

        {/* =====================================================
            HERO
        ===================================================== */}

        <main className="mx-auto flex min-h-[calc(100vh-100px)] max-w-7xl flex-col items-center px-5 pb-16 pt-20 text-center sm:px-8 lg:px-10 lg:pt-24">
          {/* AI Badge */}

          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/10 px-4 py-2 shadow-lg shadow-indigo-950/20 backdrop-blur-md">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-400/20 text-xs text-indigo-300">
              ✦
            </span>

            <span className="text-xs font-semibold tracking-wide text-indigo-200 sm:text-sm">
              AI-POWERED CAMPUS LOST & FOUND
            </span>

            <span className="ml-1 h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-300" />
          </div>

          {/* Heading */}

          <h1 className="max-w-5xl text-5xl font-bold leading-[1.05] tracking-[-0.04em] sm:text-6xl md:text-7xl lg:text-8xl">
            Lost something?
            <br />

            <span className="bg-gradient-to-r from-indigo-200 via-violet-300 to-purple-300 bg-clip-text text-transparent">
              Find it back.
            </span>
          </h1>

          {/* Description */}

          <p className="mt-7 max-w-2xl text-base leading-7 text-white/55 sm:text-lg sm:leading-8">
            FindBack uses intelligent matching to connect lost items with
            their potential owners — making campus recovery faster, smarter,
            and easier.
          </p>

          {/* CTA */}

          <div className="mt-10 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
            <Link
              to="/login"
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-slate-950 shadow-2xl shadow-indigo-950/30 transition duration-300 hover:-translate-y-1 hover:bg-white/90 sm:w-auto"
            >
              Report Lost Item

              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>

            <Link
              to="/login"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.06] px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:bg-white/10 sm:w-auto"
            >
              Report Found Item
            </Link>
          </div>

          {/* Trust line */}

          <div className="mt-7 flex items-center gap-2 text-xs text-white/35">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-300">
              ✓
            </span>
            Admin verified · Campus focused · Privacy conscious
          </div>

          {/* =================================================
              FEATURE CARDS
          ================================================= */}

          <div className="mt-20 grid w-full max-w-5xl grid-cols-1 gap-4 md:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-white/10 bg-white/[0.045] p-6 text-left shadow-2xl shadow-black/10 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.07]"
              >
                {/* Icon */}

                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-indigo-400/20 bg-indigo-400/10 text-lg text-indigo-300 transition group-hover:scale-105">
                  {feature.icon}
                </div>

                {/* Title */}

                <h3 className="text-base font-semibold text-white">
                  {feature.title}
                </h3>

                {/* Description */}

                <p className="mt-2 text-sm leading-6 text-white/40">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* =================================================
              MINI PRODUCT PREVIEW
          ================================================= */}

          <div className="relative mt-16 w-full max-w-4xl">
            {/* Glow behind preview */}

            <div className="absolute -inset-10 -z-10 rounded-full bg-indigo-500/10 blur-3xl" />

            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.045] p-2 shadow-2xl shadow-black/30 backdrop-blur-xl">
              <div className="rounded-2xl border border-white/10 bg-[#080c1d]/90 p-5 sm:p-7">
                {/* Browser top bar */}

                <div className="mb-6 flex items-center justify-between">
                  <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                    <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                    <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                  </div>

                  <div className="rounded-lg border border-white/5 bg-white/[0.03] px-4 py-1.5 text-[10px] text-white/30">
                    findback.app/matches
                  </div>

                  <div className="w-10" />
                </div>

                {/* Fake dashboard */}

                <div className="grid gap-4 md:grid-cols-[1fr_1.4fr]">
                  {/* User item */}

                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left">
                    <div className="text-[10px] font-semibold uppercase tracking-widest text-white/30">
                      Your lost item
                    </div>

                    <div className="mt-5 flex items-center gap-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 text-2xl">
                        📱
                      </div>

                      <div>
                        <div className="text-sm font-semibold">
                          Samsung Galaxy
                        </div>

                        <div className="mt-1 text-xs text-white/35">
                          BBA Faculty · Black
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AI match */}

                  <div className="rounded-2xl border border-indigo-400/20 bg-indigo-400/[0.06] p-5 text-left">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-indigo-300">✦</span>

                        <span className="text-[10px] font-semibold uppercase tracking-widest text-indigo-200/70">
                          AI Possible Match
                        </span>
                      </div>

                      <div className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-300">
                        94% similarity
                      </div>
                    </div>

                    <div className="mt-5 flex items-center gap-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/30 to-purple-500/20 text-2xl">
                        📱
                      </div>

                      <div>
                        <div className="text-sm font-semibold">
                          Black Samsung Phone
                        </div>

                        <div className="mt-1 text-xs text-white/35">
                          Same category · Similar description · Similar location
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI processing line */}

                <div className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-white/5 bg-white/[0.025] py-3 text-xs text-white/30">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-400" />
                  AI analyzes descriptions, categories, locations & images
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}

          <footer className="mt-16 pb-4 text-center text-xs text-white/25">
            <p>
              Developed by <span className="font-medium text-white/45">Abdulah Mohammad Mahin</span>
            </p>
            <p className="mt-1">
              © 2026 FindBack · Smart Campus Lost & Found. All rights reserved.
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default Home;