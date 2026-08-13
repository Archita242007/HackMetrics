"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  collection,
  onSnapshot,
} from "firebase/firestore";
import {
  onAuthStateChanged,
  signOut,
  User,
} from "firebase/auth";

import {
  BarChart3,
  CheckCircle2,
  Loader2,
  LogOut,
  ShieldCheck,
  Trophy,
  Users,
  ClipboardCheck,
} from "lucide-react";

import { auth, db } from "@/lib/firebase";

const ADMIN_UID = "ZDNeRmAzRhR752C1caUIIrXUgps1";

const teams = [
  {
    id: "PHX-01",
    name: "Phoenix",
    project: "EcoVision",
  },
  {
    id: "NVA-02",
    name: "Nova",
    project: "MedAssist",
  },
  {
    id: "QTM-03",
    name: "Quantum",
    project: "AgriSense",
  },
  {
    id: "BYT-04",
    name: "ByteForce",
    project: "TransitX",
  },
];

type Evaluation = {
  id: string;
  teamId: string;
  teamName: string;
  project: string;
  judgeId: string;
  innovation: number;
  codeQuality: number;
  presentation: number;
  total: number;
};

type TeamStats = {
  teamId: string;
  teamName: string;
  project: string;
  evaluations: number;
  totalScore: number;
  averageScore: number;
};

export default function AdminPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  const [accessDenied, setAccessDenied] = useState(false);

  /*
   * Admin authentication
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        if (!currentUser) {
          router.replace("/login");
          return;
        }

        if (currentUser.uid !== ADMIN_UID) {
          setAccessDenied(true);
          setAuthLoading(false);

          setTimeout(() => {
            router.replace("/judge");
          }, 1500);

          return;
        }

        setUser(currentUser);
        setAuthLoading(false);
      }
    );

    return () => unsubscribe();
  }, [router]);

  /*
   * Load evaluations in real time
   */
  useEffect(() => {
    if (!user || user.uid !== ADMIN_UID) return;

    const unsubscribe = onSnapshot(
      collection(db, "evaluations"),
      (snapshot) => {
        const data: Evaluation[] = snapshot.docs.map(
          (document) => ({
            id: document.id,
            ...document.data(),
          })
        ) as Evaluation[];

        setEvaluations(data);
        setDataLoading(false);
      },
      (error) => {
        console.error(
          "Error loading admin evaluations:",
          error
        );

        setDataLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  /*
   * Team statistics
   */
  const teamStats = useMemo<TeamStats[]>(() => {
    const grouped: Record<string, TeamStats> = {};

    teams.forEach((team) => {
      grouped[team.id] = {
        teamId: team.id,
        teamName: team.name,
        project: team.project,
        evaluations: 0,
        totalScore: 0,
        averageScore: 0,
      };
    });

    evaluations.forEach((evaluation) => {
      if (!grouped[evaluation.teamId]) {
        grouped[evaluation.teamId] = {
          teamId: evaluation.teamId,
          teamName: evaluation.teamName,
          project: evaluation.project,
          evaluations: 0,
          totalScore: 0,
          averageScore: 0,
        };
      }

      grouped[evaluation.teamId].evaluations += 1;
      grouped[evaluation.teamId].totalScore +=
        evaluation.total;
    });

    return Object.values(grouped)
      .map((team) => ({
        ...team,
        averageScore:
          team.evaluations > 0
            ? team.totalScore / team.evaluations
            : 0,
      }))
      .sort(
        (a, b) =>
          b.averageScore - a.averageScore
      );
  }, [evaluations]);

  /*
   * Statistics
   */
  const totalTeams = teams.length;

  const totalJudges = new Set(
    evaluations.map(
      (evaluation) => evaluation.judgeId
    )
  ).size;

  const totalEvaluations = evaluations.length;

  const expectedEvaluations = totalTeams * 2;

  const completedTeams = teamStats.filter(
    (team) => team.evaluations >= 2
  ).length;

  /*
   * Logout
   */
  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/login");
    } catch (error) {
      console.error(
        "Admin logout failed:",
        error
      );
    }
  };

  /*
   * Loading
   */
  if (authLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#05070d] text-white">
        <div className="flex items-center gap-3 text-sm text-white/40">
          <Loader2 className="h-5 w-5 animate-spin text-indigo-400" />
          Checking admin access...
        </div>
      </main>
    );
  }

  /*
   * Access denied
   */
  if (accessDenied) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#05070d] px-6 text-white">
        <div className="rounded-3xl border border-red-400/20 bg-red-400/5 p-8 text-center">
          <ShieldCheck className="mx-auto h-10 w-10 text-red-400" />

          <h1 className="mt-4 text-xl font-semibold">
            Access denied
          </h1>

          <p className="mt-2 text-sm text-white/40">
            This account is not authorized to access
            the organizer dashboard.
          </p>

          <p className="mt-4 text-xs text-white/25">
            Redirecting to Judge Portal...
          </p>
        </div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#05070d] text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_0%,rgba(99,102,241,0.14),transparent_35%)]" />

        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* Navbar */}
      <header className="relative z-10 border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-400/20 bg-indigo-500/10">
              <ShieldCheck className="h-5 w-5 text-indigo-300" />
            </div>

            <div>
              <div className="text-sm font-semibold tracking-[0.18em]">
                HACK
                <span className="text-indigo-400">
                  METRICS
                </span>
              </div>

              <div className="text-[9px] uppercase tracking-[0.25em] text-white/35">
                Organizer Dashboard
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-xs text-emerald-300">
                Organizer
              </p>

              <p className="max-w-[200px] truncate text-[10px] text-white/30">
                {user.email}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="flex h-9 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 text-xs text-white/50 transition hover:bg-white/[0.06] hover:text-white"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">
                Logout
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-10 lg:px-8">
        {/* Heading */}
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.2em] text-indigo-300">
            Organizer Console
          </p>

          <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">
            Hackathon Overview
          </h1>

          <p className="mt-2 text-sm text-white/40">
            Monitor judging progress and live team rankings.
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<Users className="h-5 w-5" />}
            label="Teams"
            value={totalTeams}
          />

          <StatCard
            icon={<ShieldCheck className="h-5 w-5" />}
            label="Judges"
            value={totalJudges}
          />

          <StatCard
            icon={<ClipboardCheck className="h-5 w-5" />}
            label="Evaluations"
            value={`${totalEvaluations}/${expectedEvaluations}`}
          />

          <StatCard
            icon={<CheckCircle2 className="h-5 w-5" />}
            label="Teams Completed"
            value={`${completedTeams}/${totalTeams}`}
          />
        </div>

        {/* Progress */}
        <section className="mt-5 rounded-3xl border border-white/10 bg-white/[0.025] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-white/30">
                Judging Progress
              </p>

              <h2 className="mt-1 text-lg font-medium">
                Evaluation completion
              </h2>
            </div>

            <span className="font-mono text-lg text-indigo-300">
              {expectedEvaluations === 0
                ? 0
                : Math.min(
                    100,
                    Math.round(
                      (totalEvaluations /
                        expectedEvaluations) *
                        100
                    )
                  )}
              %
            </span>
          </div>

          <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full rounded-full bg-indigo-500 transition-all"
              style={{
                width: `${
                  expectedEvaluations === 0
                    ? 0
                    : Math.min(
                        100,
                        (totalEvaluations /
                          expectedEvaluations) *
                          100
                      )
                }%`,
              }}
            />
          </div>
        </section>

        {/* Leaderboard */}
        <section className="mt-5 rounded-3xl border border-white/10 bg-white/[0.025] p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10">
              <Trophy className="h-5 w-5 text-indigo-300" />
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-white/30">
                Live Ranking
              </p>

              <h2 className="text-lg font-medium">
                Team leaderboard
              </h2>
            </div>
          </div>

          {dataLoading ? (
            <div className="flex items-center gap-2 py-8 text-sm text-white/40">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading evaluations...
            </div>
          ) : (
            <div className="space-y-3">
              {teamStats.map((team, index) => (
                <div
                  key={team.teamId}
                  className="rounded-2xl border border-white/10 bg-white/[0.02] p-5"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    {/* Rank */}
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 font-semibold text-indigo-300">
                      #{index + 1}
                    </div>

                    {/* Team */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-medium">
                          {team.teamName}
                        </h3>

                        <span className="font-mono text-[10px] text-white/25">
                          {team.teamId}
                        </span>
                      </div>

                      <p className="mt-1 text-xs text-white/35">
                        {team.project}
                      </p>
                    </div>

                    {/* Evaluations */}
                    <div className="text-sm text-white/40">
                      {team.evaluations}/2 judges
                    </div>

                    {/* Score */}
                    <div className="min-w-[100px] text-right">
                      <p className="font-mono text-2xl font-semibold">
                        {team.evaluations > 0
                          ? team.averageScore.toFixed(1)
                          : "—"}
                      </p>

                      <p className="text-[10px] uppercase tracking-wider text-white/25">
                        average / 30
                      </p>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full bg-indigo-500 transition-all"
                      style={{
                        width: `${
                          (team.averageScore / 30) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Evaluation status */}
        <section className="mt-5 rounded-3xl border border-white/10 bg-white/[0.025] p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5">
              <BarChart3 className="h-5 w-5 text-white/50" />
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-white/30">
                Evaluation Status
              </p>

              <h2 className="text-lg font-medium">
                Team progress
              </h2>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left">
              <thead>
                <tr className="border-b border-white/10 text-[10px] uppercase tracking-wider text-white/25">
                  <th className="pb-3">Team</th>
                  <th className="pb-3">Project</th>
                  <th className="pb-3">Evaluations</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">
                    Average
                  </th>
                </tr>
              </thead>

              <tbody>
                {teamStats.map((team) => {
                  const complete =
                    team.evaluations >= 2;

                  return (
                    <tr
                      key={team.teamId}
                      className="border-b border-white/5 last:border-0"
                    >
                      <td className="py-4 text-sm font-medium">
                        {team.teamName}
                      </td>

                      <td className="py-4 text-sm text-white/40">
                        {team.project}
                      </td>

                      <td className="py-4 text-sm text-white/50">
                        {team.evaluations}/2
                      </td>

                      <td className="py-4">
                        {complete ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/10 bg-emerald-400/5 px-2.5 py-1 text-[10px] text-emerald-300">
                            <CheckCircle2 className="h-3 w-3" />
                            Complete
                          </span>
                        ) : (
                          <span className="rounded-full border border-amber-400/10 bg-amber-400/5 px-2.5 py-1 text-[10px] text-amber-300">
                            Pending
                          </span>
                        )}
                      </td>

                      <td className="py-4 text-right font-mono text-sm">
                        {team.evaluations > 0
                          ? team.averageScore.toFixed(1)
                          : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-5">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-300">
          {icon}
        </div>
      </div>

      <p className="mt-5 text-xs uppercase tracking-wider text-white/30">
        {label}
      </p>

      <p className="mt-1 font-mono text-2xl font-semibold">
        {value}
      </p>
    </div>
  );
}