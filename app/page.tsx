"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Code2,
  Layers3,
  Radio,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import type { ReactNode } from "react";

const leaderboard = [
  {
    rank: 1,
    team: "Phoenix",
    project: "EcoVision",
    score: "28.7",
    trend: "+1.8",
  },
  {
    rank: 2,
    team: "Nova",
    project: "MedAssist",
    score: "27.9",
    trend: "+0.9",
  },
  {
    rank: 3,
    team: "Quantum",
    project: "AgriSense",
    score: "26.8",
    trend: "+1.4",
  },
  {
    rank: 4,
    team: "ByteForce",
    project: "TransitX",
    score: "25.9",
    trend: "+0.6",
  },
];

const features = [
  {
    icon: Radio,
    title: "Real-time scoring",
    description:
      "Scores sync instantly across the judging panel and leaderboard.",
  },
  {
    icon: BarChart3,
    title: "Smart rankings",
    description:
      "Automatically calculate totals and rank teams as scores change.",
  },
  {
    icon: ShieldCheck,
    title: "Transparent judging",
    description:
      "Keep evaluation structured, consistent, and easy to audit.",
  },
  {
    icon: Zap,
    title: "Built for speed",
    description:
      "Designed for high-pressure hackathons where every second matters.",
  },
];

const steps = [
  {
    number: "01",
    title: "Select a team",
    description:
      "Choose the team you want to evaluate from the judging panel.",
  },
  {
    number: "02",
    title: "Score the criteria",
    description:
      "Rate innovation, code quality, and presentation on a 1–10 scale.",
  },
  {
    number: "03",
    title: "Watch rankings update",
    description:
      "Scores are aggregated and reflected on the live leaderboard instantly.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#05070d] text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 -z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.16),transparent_35%)]" />

        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* Navbar */}
      <nav className="relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 lg:px-8">
        <a href="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5">
            <Trophy className="h-4 w-4 text-indigo-300" />
          </div>

          <div>
            <div className="text-sm font-semibold tracking-[0.2em]">
              HACK<span className="text-indigo-400">METRICS</span>
            </div>

            <div className="text-[9px] uppercase tracking-[0.25em] text-white/35">
              Judging platform
            </div>
          </div>
        </a>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-8 text-sm text-white/55 md:flex">
          <a
            href="#features"
            className="transition-colors hover:text-white"
          >
            Features
          </a>

          <a
            href="#how-it-works"
            className="transition-colors hover:text-white"
          >
            How it works
          </a>

          <a
            href="#leaderboard"
            className="transition-colors hover:text-white"
          >
            Leaderboard
          </a>
        </div>

        {/* Navbar CTA */}
        <a
          href="/judge"
          className="inline-flex h-10 items-center justify-center rounded-full bg-white px-5 text-sm font-medium text-black transition-colors hover:bg-white/90"
        >
          Judge Portal
          <ArrowRight className="ml-2 h-4 w-4" />
        </a>
      </nav>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-20 pt-16 lg:px-8 lg:pb-28 lg:pt-24">
        <div className="grid items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Hero copy */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/5 px-3 py-1.5 text-xs text-indigo-200">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>

              HACKATHON LIVE

              <ChevronRight className="h-3 w-3 text-white/30" />

              Round 01
            </div>

            <h1 className="max-w-4xl text-5xl font-semibold leading-[1.02] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
              Where great ideas
              <br />

              <span className="bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
                rise to the top.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-7 text-white/50 sm:text-lg">
              A real-time judging and leaderboard platform built for modern
              hackathons. Score teams, track performance, and watch rankings
              evolve instantly.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href="/judge"
                className="inline-flex h-12 items-center justify-center rounded-full bg-indigo-500 px-7 text-sm font-medium text-white shadow-lg shadow-indigo-500/20 transition-colors hover:bg-indigo-400"
              >
                Enter Judge Portal
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>

              <a
                href="#leaderboard"
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] px-7 text-sm font-medium text-white transition-colors hover:bg-white/[0.07]"
              >
                View leaderboard
              </a>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 text-xs text-white/35">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Real-time updates
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Automated ranking
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Secure judging
              </div>
            </div>
          </motion.div>

          {/* Hero leaderboard card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            id="leaderboard"
            className="relative"
          >
            <div className="absolute -inset-8 rounded-full bg-indigo-500/10 blur-3xl" />

            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] shadow-2xl shadow-black/40 backdrop-blur-xl">
              {/* Card header */}
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Radio className="h-4 w-4 text-emerald-400" />
                    Live leaderboard
                  </div>

                  <p className="mt-1 text-xs text-white/35">
                    Updated just now
                  </p>
                </div>

                <div className="flex items-center gap-2 rounded-full border border-emerald-400/10 bg-emerald-400/5 px-2.5 py-1 text-[10px] uppercase tracking-wider text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Live
                </div>
              </div>

              {/* Leaderboard */}
              <div className="p-3">
                {leaderboard.map((team, index) => (
                  <motion.div
                    key={team.team}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.4 + index * 0.1,
                    }}
                    className="group flex items-center gap-4 rounded-2xl px-3 py-4 transition-colors hover:bg-white/[0.04]"
                  >
                    <div className="w-6 text-center font-mono text-xs text-white/30">
                      {String(team.rank).padStart(2, "0")}
                    </div>

                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
                        team.rank === 1
                          ? "border-indigo-400/30 bg-indigo-400/10 text-indigo-200"
                          : "border-white/10 bg-white/[0.04] text-white/45"
                      }`}
                    >
                      {team.rank === 1 ? (
                        <Trophy className="h-4 w-4" />
                      ) : (
                        <span className="font-mono text-xs">
                          {team.rank}
                        </span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-white">
                        {team.team}
                      </p>

                      <p className="truncate text-xs text-white/35">
                        {team.project}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-mono text-sm font-semibold">
                        {team.score}
                      </p>

                      <p className="text-[10px] text-emerald-400">
                        {team.trend}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Card footer */}
              <div className="border-t border-white/10 px-5 py-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/35">
                    24 teams competing
                  </span>

                  <a
                    href="#leaderboard"
                    className="flex items-center gap-1 text-indigo-300 transition-colors hover:text-indigo-200"
                  >
                    Full rankings
                    <ArrowRight className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative z-10 border-y border-white/10 bg-white/[0.015]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-white/10 md:grid-cols-4 lg:px-8">
          <Stat
            value="24"
            label="Teams competing"
            icon={<Users className="h-4 w-4" />}
          />

          <Stat
            value="18"
            label="Judges active"
            icon={<Users className="h-4 w-4" />}
          />

          <Stat
            value="03"
            label="Scoring criteria"
            icon={<BarChart3 className="h-4 w-4" />}
          />

          <Stat
            value="28.7"
            label="Current high score"
            icon={<Trophy className="h-4 w-4" />}
          />
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="relative z-10 mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32"
      >
        <div className="max-w-2xl">
          <div className="mb-4 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-indigo-300">
            <Sparkles className="h-4 w-4" />
            Built for the final round
          </div>

          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Everything judges need.
            <br />
            Nothing they don&apos;t.
          </h2>

          <p className="mt-5 text-sm leading-6 text-white/45 sm:text-base">
            HackMetrics removes the friction from hackathon evaluation so
            judges can focus on what actually matters: the ideas.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  margin: "-80px",
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                }}
                className="group rounded-3xl border border-white/10 bg-white/[0.025] p-7 transition-colors hover:border-indigo-400/20 hover:bg-white/[0.04]"
              >
                <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl border border-indigo-400/15 bg-indigo-400/10 text-indigo-300">
                  <Icon className="h-5 w-5" />
                </div>

                <h3 className="text-lg font-medium">
                  {feature.title}
                </h3>

                <p className="mt-2 max-w-md text-sm leading-6 text-white/40">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="relative z-10 border-y border-white/10 bg-white/[0.015]"
      >
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
          <div className="grid gap-16 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <div className="mb-4 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-indigo-300">
                <Layers3 className="h-4 w-4" />
                Simple workflow
              </div>

              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                From first score
                <br />
                to final ranking.
              </h2>

              <p className="mt-5 max-w-md text-sm leading-6 text-white/40 sm:text-base">
                A streamlined judging flow designed to keep evaluation fast,
                structured, and transparent.
              </p>
            </div>

            <div className="space-y-3">
              {steps.map((step, index) => (
                <motion.div
                  key={step.number}
                  initial={{
                    opacity: 0,
                    x: 20,
                  }}
                  whileInView={{
                    opacity: 1,
                    x: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                  }}
                  className="flex gap-5 rounded-2xl border border-white/10 bg-white/[0.025] p-5"
                >
                  <div className="font-mono text-xs text-indigo-300/70">
                    {step.number}
                  </div>

                  <div>
                    <h3 className="text-sm font-medium">
                      {step.title}
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-white/40">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Technology */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-500/10 via-white/[0.02] to-transparent p-8 sm:p-10">
          <div className="grid gap-8 md:grid-cols-3 md:items-center">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/35">
                <Code2 className="h-4 w-4" />
                Built with modern tech
              </div>

              <p className="mt-3 text-sm leading-6 text-white/50">
                A fast, responsive interface designed to handle live judging
                without getting in the way.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 md:col-span-2 sm:grid-cols-4">
              {["Next.js", "TypeScript", "Firebase", "Vercel"].map(
                (tech) => (
                  <div
                    key={tech}
                    className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-center text-xs text-white/55"
                  >
                    {tech}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        id="cta"
        className="relative z-10 mx-auto max-w-7xl px-6 pb-20 pt-8 lg:px-8 lg:pb-28"
      >
        <div className="relative overflow-hidden rounded-[2rem] border border-indigo-400/20 bg-indigo-500/[0.08] px-6 py-16 text-center sm:px-10">
          <div className="absolute left-1/2 top-0 h-40 w-80 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl" />

          <div className="relative">
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-300/20 bg-indigo-400/10">
              <Trophy className="h-5 w-5 text-indigo-300" />
            </div>

            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Ready to judge what&apos;s next?
            </h2>

            <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-white/45">
              Enter the judging portal to score teams and watch the
              leaderboard come alive.
            </p>

            <a
              href="/judge"
              className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-white px-7 text-sm font-medium text-black transition-colors hover:bg-white/90"
            >
              Enter Judge Portal
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-8 text-xs text-white/30 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div className="flex items-center gap-2">
            <Trophy className="h-3.5 w-3.5" />
            <span>HackMetrics © 2026</span>
          </div>

          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5">
              <Clock3 className="h-3.5 w-3.5" />
              Live judging
            </span>

            <a
              href="https://github.com/Archita242007"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 transition-colors hover:text-white"
            >
              GitHub
             <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

function Stat({
  value,
  label,
  icon,
}: {
  value: string;
  label: string;
  icon: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 px-5 py-7 sm:px-8">
      <div className="flex items-center gap-2 text-white/25">
        {icon}

        <span className="text-[10px] uppercase tracking-wider">
          Live metric
        </span>
      </div>

      <div>
        <div className="font-mono text-2xl font-semibold tracking-tight">
          {value}
        </div>

        <div className="mt-1 text-xs text-white/35">
          {label}
        </div>
      </div>
    </div>
  );
}