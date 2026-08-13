"use client";

import { useEffect, useMemo, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
} from "firebase/firestore";
import {
  BarChart3,
  CheckCircle2,
  Crown,
  Medal,
  RefreshCw,
  Trophy,
  Users,
  Wifi,
} from "lucide-react";

import { db } from "@/lib/firebase";

type Evaluation = {
  id: string;
  teamId: string;
  teamName: string;
  project: string;
  total: number;
  judgeId?: string;
};

type TeamResult = {
  teamId: string;
  teamName: string;
  project: string;
  evaluations: number;
  totalScore: number;
  averageScore: number;
};

export default function ResultsPage() {
  const [results, setResults] = useState<TeamResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(
    null
  );

  /*
   * Listen to Firestore in real time.
   */
  useEffect(() => {
    console.log("RESULTS PAGE EFFECT STARTED");

    const evaluationsQuery = query(
      collection(db, "evaluations")
    );

    const unsubscribe = onSnapshot(
      evaluationsQuery,
      (snapshot) => {
        console.log(
          "Firestore update received:",
          snapshot.size
        );

        const evaluations: Evaluation[] =
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Evaluation[];

        /*
         * Group evaluations by team.
         *
         * Example:
         *
         * Phoenix
         * Judge A -> 24
         * Judge B -> 27
         * Judge C -> 26
         *
         * Average = 25.67
         */
        const grouped: Record<string, TeamResult> = {};

        evaluations.forEach((evaluation) => {
          if (!evaluation.teamId) return;

          if (!grouped[evaluation.teamId]) {
            grouped[evaluation.teamId] = {
              teamId: evaluation.teamId,
              teamName:
                evaluation.teamName || "Unknown Team",
              project:
                evaluation.project || "Unknown Project",
              evaluations: 0,
              totalScore: 0,
              averageScore: 0,
            };
          }

          grouped[evaluation.teamId].evaluations += 1;

          grouped[evaluation.teamId].totalScore +=
            Number(evaluation.total) || 0;
        });

        /*
         * Calculate average.
         */
        const leaderboard = Object.values(grouped).map(
          (team) => ({
            ...team,
            averageScore:
              team.evaluations > 0
                ? team.totalScore / team.evaluations
                : 0,
          })
        );

        /*
         * Highest average first.
         *
         * If averages are equal, the team with
         * more evaluations comes first.
         */
        leaderboard.sort((a, b) => {
          if (b.averageScore !== a.averageScore) {
            return b.averageScore - a.averageScore;
          }

          return b.evaluations - a.evaluations;
        });

        setResults(leaderboard);
        setLastUpdated(new Date());
        setLoading(false);
      },
      (error) => {
        console.error(
          "Firestore listener error:",
          error
        );

        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  /*
   * Overall statistics.
   */
  const stats = useMemo(() => {
    const totalEvaluations = results.reduce(
      (sum, team) => sum + team.evaluations,
      0
    );

    return {
      teams: results.length,
      evaluations: totalEvaluations,
    };
  }, [results]);

  /*
   * Loading state.
   */
  if (loading) {
    return (
      <main className="min-h-screen bg-[#05070d] text-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="animate-pulse">
            <div className="h-4 w-32 rounded bg-white/10" />

            <div className="mt-4 h-10 w-72 rounded bg-white/10" />

            <div className="mt-3 h-5 w-96 max-w-full rounded bg-white/5" />

            <div className="mt-10 space-y-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-32 rounded-3xl border border-white/10 bg-white/[0.025]"
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#05070d] text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 -z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.16),transparent_38%)]" />

        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* Navbar */}
      <header className="relative z-10 border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
          <div>
            <div className="text-sm font-semibold tracking-[0.18em]">
              HACK<span className="text-indigo-400">
                METRICS
              </span>
            </div>

            <div className="mt-1 text-[9px] uppercase tracking-[0.25em] text-white/30">
              Live Leaderboard
            </div>
          </div>

          {/* Live indicator */}
          <div className="flex items-center gap-2 rounded-full border border-emerald-400/10 bg-emerald-400/5 px-3 py-1.5">
            <Wifi className="h-3.5 w-3.5 text-emerald-400" />

            <span className="text-xs text-emerald-300">
              Live
            </span>

            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          </div>
        </div>
      </header>

      {/* Main */}
      <div className="relative z-10 mx-auto max-w-6xl px-6 py-10">
        {/* Header */}
        <section className="mb-10">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-indigo-300">
            <Trophy className="h-4 w-4" />

            Hackathon Rankings
          </div>

          <div className="mt-4 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                Live Leaderboard
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-white/40">
                Teams are ranked by their average score across
                all submitted judge evaluations.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-white/30">
              <RefreshCw className="h-3.5 w-3.5" />

              {lastUpdated
                ? `Updated ${lastUpdated.toLocaleTimeString()}`
                : "Waiting for updates"}
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="mb-8 grid gap-4 sm:grid-cols-3">
          <StatCard
            icon={<Trophy className="h-4 w-4" />}
            label="Teams"
            value={stats.teams.toString()}
          />

          <StatCard
            icon={<Users className="h-4 w-4" />}
            label="Evaluations"
            value={stats.evaluations.toString()}
          />

          <StatCard
            icon={<BarChart3 className="h-4 w-4" />}
            label="Max Score"
            value="30"
          />
        </section>

        {/* Empty state */}
        {results.length === 0 ? (
          <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10">
              <Trophy className="h-6 w-6 text-indigo-300" />
            </div>

            <h2 className="mt-5 text-lg font-medium">
              No evaluations yet
            </h2>

            <p className="mt-2 text-sm text-white/35">
              The leaderboard will appear once judges submit
              their evaluations.
            </p>
          </section>
        ) : (
          <section>
            {/* Section heading */}
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-white/25">
                  Rankings
                </p>

                <h2 className="mt-1 text-lg font-medium">
                  Current standings
                </h2>
              </div>

              <div className="hidden text-xs text-white/25 sm:block">
                Average score / 30
              </div>
            </div>

            {/* Leaderboard */}
            <div className="space-y-4">
              {results.map((team, index) => {
                const rank = index + 1;

                return (
                  <LeaderboardCard
                    key={team.teamId}
                    team={team}
                    rank={rank}
                  />
                );
              })}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="mt-12 border-t border-white/10 pt-6">
          <div className="flex flex-col justify-between gap-3 text-xs text-white/20 sm:flex-row">
            <p>
              HackMetrics · Hackathon Evaluation Platform
            </p>

            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400/60" />

              <span>Scores synced with Firebase</span>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}

/*
 * Leaderboard Card
 */
function LeaderboardCard({
  team,
  rank,
}: {
  team: TeamResult;
  rank: number;
}) {
  const isFirst = rank === 1;
  const isSecond = rank === 2;
  const isThird = rank === 3;

  const percentage = Math.min(
    (team.averageScore / 30) * 100,
    100
  );

  return (
    <div
      className={`group rounded-3xl border p-5 transition-all sm:p-6 ${
        isFirst
          ? "border-indigo-400/30 bg-indigo-500/[0.07] shadow-lg shadow-indigo-500/5"
          : "border-white/10 bg-white/[0.025] hover:border-white/15 hover:bg-white/[0.04]"
      }`}
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        {/* Rank */}
        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border ${
            isFirst
              ? "border-indigo-400/30 bg-indigo-500/15"
              : "border-white/10 bg-white/5"
          }`}
        >
          {isFirst ? (
            <Crown className="h-6 w-6 text-indigo-300" />
          ) : isSecond || isThird ? (
            <Medal
              className={`h-6 w-6 ${
                isSecond
                  ? "text-slate-300"
                  : "text-amber-500"
              }`}
            />
          ) : (
            <span className="font-mono text-lg font-semibold text-white/40">
              #{rank}
            </span>
          )}
        </div>

        {/* Team information */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-xl font-medium">
              {team.teamName}
            </h2>

            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 font-mono text-[9px] text-white/25">
              {team.teamId}
            </span>
          </div>

          <p className="mt-1 text-sm text-white/40">
            {team.project}
          </p>

          <div className="mt-3 flex items-center gap-2 text-xs text-white/25">
            <Users className="h-3.5 w-3.5" />

            <span>
              {team.evaluations}{" "}
              {team.evaluations === 1
                ? "judge evaluation"
                : "judge evaluations"}
            </span>
          </div>
        </div>

        {/* Score */}
        <div className="sm:min-w-[130px] sm:text-right">
          <div className="font-mono text-3xl font-semibold">
            {team.averageScore.toFixed(1)}
          </div>

          <div className="text-xs text-white/25">
            average / 30
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="mt-5">
        <div className="mb-2 flex justify-between text-[10px] uppercase tracking-wider text-white/20">
          <span>Performance</span>

          <span>
            {percentage.toFixed(0)}%
          </span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-white/5">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              isFirst
                ? "bg-indigo-500"
                : "bg-indigo-500/60"
            }`}
            style={{
              width: `${percentage}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

/*
 * Statistics card
 */
function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
      <div className="flex items-center gap-2 text-white/30">
        {icon}

        <span className="text-[10px] uppercase tracking-[0.18em]">
          {label}
        </span>
      </div>

      <div className="mt-3 font-mono text-2xl font-semibold">
        {value}
      </div>
    </div>
  );
}