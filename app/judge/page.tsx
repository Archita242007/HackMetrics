"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  Code2,
  FileText,
  Gauge,
  LogOut,
  Loader2,
  Presentation,
  RotateCcw,
  Send,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";

import {
  onAuthStateChanged,
  signOut,
  User,
} from "firebase/auth";

import { auth, db } from "@/lib/firebase";

/* =========================================================
   TEAMS
========================================================= */

const teams = [
  {
    id: "PHX-01",
    name: "Phoenix",
    project: "EcoVision",
    description:
      "AI-powered environmental monitoring platform for smart cities.",
    members: 4,
  },
  {
    id: "NVA-02",
    name: "Nova",
    project: "MedAssist",
    description:
      "Intelligent healthcare assistant designed to simplify patient support.",
    members: 3,
  },
  {
    id: "QTM-03",
    name: "Quantum",
    project: "AgriSense",
    description:
      "Smart agriculture system using predictive analytics for crop health.",
    members: 4,
  },
  {
    id: "BYT-04",
    name: "ByteForce",
    project: "TransitX",
    description:
      "Real-time public transportation optimization and tracking system.",
    members: 5,
  },
];

/* =========================================================
   CRITERIA
========================================================= */

const criteria = [
  {
    key: "innovation",
    title: "Innovation",
    description:
      "Originality and creativity of the solution.",
    icon: Sparkles,
  },
  {
    key: "codeQuality",
    title: "Code Quality",
    description:
      "Architecture, implementation and technical quality.",
    icon: Code2,
  },
  {
    key: "presentation",
    title: "Presentation",
    description:
      "Clarity, communication and demonstration quality.",
    icon: Presentation,
  },
] as const;

/* =========================================================
   TYPES
========================================================= */

type Scores = {
  innovation: number;
  codeQuality: number;
  presentation: number;
};

/* =========================================================
   JUDGE PAGE
========================================================= */

export default function JudgePage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);

  const [authLoading, setAuthLoading] =
    useState(true);

  const [selectedTeam, setSelectedTeam] =
    useState(teams[0]);

  const [scores, setScores] = useState<Scores>({
    innovation: 0,
    codeQuality: 0,
    presentation: 0,
  });

  const [submitted, setSubmitted] =
    useState(false);

  const [alreadyEvaluated, setAlreadyEvaluated] =
    useState(false);

  const [checkingEvaluation, setCheckingEvaluation] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [evaluatedTeams, setEvaluatedTeams] =
    useState<string[]>([]);

  /* =======================================================
     AUTHENTICATION
  ======================================================= */

  useEffect(() => {
    let mounted = true;

    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        if (!mounted) return;

        if (!currentUser) {
          setUser(null);
          setAuthLoading(false);

          /*
           * Full browser navigation is intentional.
           * It avoids the Next.js client-side navigation
           * getting stuck on "Rendering".
           */
          window.location.replace("/login");

          return;
        }

        setUser(currentUser);
        setAuthLoading(false);
      }
    );

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  /* =======================================================
     LOAD CURRENT JUDGE'S EVALUATIONS
  ======================================================= */

  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    const loadEvaluations = async () => {
      try {
        setCheckingEvaluation(true);

        const evaluationsRef =
          collection(db, "evaluations");

        const evaluationsQuery = query(
          evaluationsRef,
          where("judgeId", "==", user.uid)
        );

        const snapshot =
          await getDocs(evaluationsQuery);

        if (cancelled) return;

        const teamIds = snapshot.docs
          .map((evaluation) => {
            const data = evaluation.data();

            return data.teamId as string;
          })
          .filter(Boolean);

        console.log(
          "Current judge evaluations:",
          teamIds
        );

        setEvaluatedTeams(teamIds);

        const selectedAlreadyEvaluated =
          teamIds.includes(selectedTeam.id);

        setAlreadyEvaluated(
          selectedAlreadyEvaluated
        );

        setCheckingEvaluation(false);
      } catch (error) {
        console.error(
          "Error checking evaluation:",
          error
        );

        if (!cancelled) {
          setCheckingEvaluation(false);
        }
      }
    };

    loadEvaluations();

    return () => {
      cancelled = true;
    };
  }, [user, selectedTeam.id]);

  /* =======================================================
     TOTAL
  ======================================================= */

  const total = useMemo(() => {
    return (
      scores.innovation +
      scores.codeQuality +
      scores.presentation
    );
  }, [scores]);

  /* =======================================================
     AVERAGE
  ======================================================= */

  const average = useMemo(() => {
    if (total === 0) {
      return "0.0";
    }

    return (total / 3).toFixed(1);
  }, [total]);

  /* =======================================================
     UPDATE SCORE
  ======================================================= */

  const updateScore = (
    key: keyof Scores,
    value: number
  ) => {
    if (alreadyEvaluated || submitting) {
      return;
    }

    setScores((previous) => ({
      ...previous,
      [key]: value,
    }));

    setSubmitted(false);
  };

  /* =======================================================
     RESET
  ======================================================= */

  const resetScores = () => {
    if (alreadyEvaluated || submitting) {
      return;
    }

    setScores({
      innovation: 0,
      codeQuality: 0,
      presentation: 0,
    });

    setSubmitted(false);
  };

  /* =======================================================
     SELECT TEAM
  ======================================================= */

  const handleTeamSelect = (
    team: (typeof teams)[number]
  ) => {
    if (submitting) {
      return;
    }

    setSelectedTeam(team);

    setScores({
      innovation: 0,
      codeQuality: 0,
      presentation: 0,
    });

    setSubmitted(false);

    setAlreadyEvaluated(
      evaluatedTeams.includes(team.id)
    );

    setCheckingEvaluation(false);
  };

  /* =======================================================
     SUBMIT EVALUATION
  ======================================================= */

  const submitScores = async () => {
    if (!user) {
      window.location.replace("/login");
      return;
    }

    if (alreadyEvaluated) {
      return;
    }

    if (
      scores.innovation === 0 ||
      scores.codeQuality === 0 ||
      scores.presentation === 0
    ) {
      alert(
        "Please give a score for all three criteria."
      );

      return;
    }

    try {
      setSubmitting(true);

      /*
       * One evaluation per judge per team.
       *
       * Example:
       *
       * USER_UID_PHX-01
       */
      const evaluationId =
        `${user.uid}_${selectedTeam.id}`;

      const evaluationRef = doc(
        db,
        "evaluations",
        evaluationId
      );

      /*
       * Firestore security rules also enforce
       * that the document ID belongs to this judge.
       */

      await setDoc(evaluationRef, {
        teamId: selectedTeam.id,

        teamName: selectedTeam.name,

        project: selectedTeam.project,

        innovation: scores.innovation,

        codeQuality: scores.codeQuality,

        presentation: scores.presentation,

        total,

        average: Number(average),

        judgeId: user.uid,

        judgeEmail: user.email ?? "",

        createdAt: serverTimestamp(),
      });

      /*
       * Update local state immediately.
       */

      setEvaluatedTeams((previous) => [
        ...previous,
        selectedTeam.id,
      ]);

      setAlreadyEvaluated(true);

      setSubmitted(true);
    } catch (error) {
      console.error(
        "Error submitting evaluation:",
        error
      );

      alert(
        "Evaluation could not be submitted. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* =======================================================
     LOGOUT
  ======================================================= */

  const handleLogout = async () => {
    if (submitting) {
      return;
    }

    try {
      /*
       * First completely sign out from Firebase.
       */
      await signOut(auth);

      /*
       * Use a full browser navigation instead of
       * router.replace().
       *
       * This prevents the "Rendering" problem that
       * can happen during the auth state transition.
       */
      window.location.replace("/login");
    } catch (error) {
      console.error(
        "Logout failed:",
        error
      );

      alert(
        "Logout failed. Please try again."
      );
    }
  };

  /* =======================================================
     AUTH LOADING
  ======================================================= */

  if (authLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#05070d] text-white">
        <div className="flex items-center gap-3 text-sm text-white/40">
          <Loader2 className="h-5 w-5 animate-spin text-indigo-400" />

          Checking judge session...
        </div>
      </main>
    );
  }

  /* =======================================================
     NO USER
  ======================================================= */

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#05070d] text-white">
        <div className="flex items-center gap-3 text-sm text-white/40">
          <Loader2 className="h-5 w-5 animate-spin text-indigo-400" />

          Redirecting to login...
        </div>
      </main>
    );
  }

  /* =======================================================
     UI
  ======================================================= */

  return (
    <main className="min-h-screen bg-[#05070d] text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 -z-0">
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
      <header className="relative z-20 border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-4 px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-colors hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>

            <div className="hidden h-8 w-px bg-white/10 sm:block" />

            <div>
              <div className="text-sm font-semibold tracking-[0.18em]">
                HACK
                <span className="text-indigo-400">
                  METRICS
                </span>
              </div>

              <div className="text-[9px] uppercase tracking-[0.25em] text-white/35">
                Judge Portal
              </div>
            </div>
          </div>

          {/* Judge session */}
          <div className="flex items-center gap-3">
            <div className="hidden rounded-full border border-emerald-400/10 bg-emerald-400/5 px-3 py-1.5 sm:block">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                <span className="text-xs text-emerald-300">
                  Judge session active
                </span>
              </div>

              <p className="mt-0.5 max-w-[180px] truncate text-[9px] text-white/30">
                {user.email}
              </p>
            </div>

            <button
              onClick={handleLogout}
              disabled={submitting}
              className="flex h-9 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 text-xs text-white/50 transition-colors hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              <LogOut className="h-3.5 w-3.5" />

              <span className="hidden sm:inline">
                Exit
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-8 lg:px-8 lg:py-10">
        {/* Heading */}
        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
          }}
          className="mb-8"
        >
          <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-indigo-300">
            <Gauge className="h-4 w-4" />

            Evaluation Console
          </div>

          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Evaluate a team.
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-white/40">
                Score each team across three criteria. Your
                evaluation contributes to the live HackMetrics
                leaderboard.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-white/35">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />

              Evaluation is secure
            </div>
          </div>
        </motion.div>

        {/* Dashboard */}
        <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
          {/* LEFT */}
          <div className="space-y-5">
            {/* Team selector */}
            <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-white/30">
                    Step 01
                  </p>

                  <h2 className="mt-1 text-lg font-medium">
                    Select team
                  </h2>
                </div>

                <Users className="h-5 w-5 text-indigo-300" />
              </div>

              <div className="space-y-2">
                {teams.map((team) => {
                  const active =
                    selectedTeam.id === team.id;

                  const evaluated =
                    evaluatedTeams.includes(team.id);

                  return (
                    <button
                      key={team.id}
                      onClick={() =>
                        handleTeamSelect(team)
                      }
                      disabled={submitting}
                      className={`w-full rounded-2xl border p-4 text-left transition-all ${
                        active
                          ? "border-indigo-400/30 bg-indigo-400/10"
                          : "border-white/10 bg-white/[0.02] hover:bg-white/[0.05]"
                      } disabled:cursor-not-allowed`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-xl text-xs font-semibold ${
                            active
                              ? "bg-indigo-500 text-white"
                              : "bg-white/5 text-white/40"
                          }`}
                        >
                          {team.id.slice(0, 2)}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-medium">
                              {team.name}
                            </p>

                            <span className="font-mono text-[10px] text-white/25">
                              {team.id}
                            </span>
                          </div>

                          <p className="mt-0.5 truncate text-xs text-white/35">
                            {team.project}
                          </p>
                        </div>

                        {evaluated ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        ) : active ? (
                          <CheckCircle2 className="h-4 w-4 text-indigo-300" />
                        ) : null}
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Team information */}
            <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5">
                  <FileText className="h-4 w-4 text-white/50" />
                </div>

                <div>
                  <p className="text-xs text-white/30">
                    Selected project
                  </p>

                  <h2 className="text-sm font-medium">
                    {selectedTeam.project}
                  </h2>
                </div>
              </div>

              <p className="text-sm leading-6 text-white/40">
                {selectedTeam.description}
              </p>

              <div className="mt-5 flex items-center gap-2 border-t border-white/10 pt-5 text-xs text-white/35">
                <Users className="h-3.5 w-3.5" />

                {selectedTeam.members} team members
              </div>
            </section>
          </div>

          {/* RIGHT */}
          <div className="space-y-5">
            {/* Scoring */}
            <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:p-7">
              <div className="mb-7 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-white/30">
                    Step 02
                  </p>

                  <h2 className="mt-1 text-lg font-medium">
                    Score the project
                  </h2>
                </div>

                <div className="rounded-xl border border-indigo-400/20 bg-indigo-400/10 px-3 py-2 text-right">
                  <p className="text-[9px] uppercase tracking-wider text-indigo-300/60">
                    Total
                  </p>

                  <p className="font-mono text-lg font-semibold text-indigo-200">
                    {total}
                    <span className="text-xs text-indigo-200/40">
                      /30
                    </span>
                  </p>
                </div>
              </div>

              {/* Checking */}
              {checkingEvaluation && (
                <div className="mb-6 flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-xs text-white/40">
                  <Loader2 className="h-4 w-4 animate-spin" />

                  Checking previous evaluations...
                </div>
              )}

              {/* Already evaluated */}
              {!checkingEvaluation &&
                alreadyEvaluated && (
                  <div className="mb-6 flex items-start gap-3 rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-4">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />

                    <div>
                      <p className="text-sm font-medium text-emerald-300">
                        Already evaluated
                      </p>

                      <p className="mt-1 text-xs leading-5 text-white/35">
                        You have already submitted an
                        evaluation for{" "}
                        {selectedTeam.name}. Each judge can
                        evaluate a team only once.
                      </p>
                    </div>
                  </div>
                )}

              {/* Criteria */}
              <div className="space-y-7">
                {criteria.map((criterion) => {
                  const Icon = criterion.icon;

                  const score =
                    scores[criterion.key];

                  return (
                    <div
                      key={criterion.key}
                      className={
                        alreadyEvaluated
                          ? "opacity-50"
                          : ""
                      }
                    >
                      <div className="mb-3 flex items-start justify-between gap-4">
                        <div className="flex gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                            <Icon className="h-4 w-4 text-indigo-300" />
                          </div>

                          <div>
                            <h3 className="text-sm font-medium">
                              {criterion.title}
                            </h3>

                            <p className="mt-0.5 text-xs text-white/35">
                              {criterion.description}
                            </p>
                          </div>
                        </div>

                        <div className="font-mono text-lg font-semibold">
                          {score}

                          <span className="text-xs text-white/25">
                            /10
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-10 gap-1.5">
                        {Array.from(
                          {
                            length: 10,
                          },
                          (_, index) => {
                            const value = index + 1;

                            const active =
                              value <= score;

                            return (
                              <button
                                key={value}
                                disabled={
                                  alreadyEvaluated ||
                                  submitting ||
                                  checkingEvaluation
                                }
                                onClick={() =>
                                  updateScore(
                                    criterion.key,
                                    value
                                  )
                                }
                                className={`h-9 rounded-lg border text-xs font-medium transition-all ${
                                  active
                                    ? "border-indigo-400/40 bg-indigo-500 text-white shadow-lg shadow-indigo-500/10"
                                    : "border-white/10 bg-white/[0.02] text-white/30 hover:border-white/20 hover:bg-white/[0.05] hover:text-white"
                                } disabled:cursor-not-allowed`}
                              >
                                {value}
                              </button>
                            );
                          }
                        )}
                      </div>

                      <div className="mt-2 flex justify-between text-[10px] text-white/20">
                        <span>
                          Needs improvement
                        </span>

                        <span>
                          Excellent
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Buttons */}
              <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row">
                <button
                  onClick={resetScores}
                  disabled={
                    alreadyEvaluated ||
                    submitting ||
                    checkingEvaluation
                  }
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-5 text-sm text-white/60 transition-colors hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <RotateCcw className="h-4 w-4" />

                  Reset
                </button>

                <button
                  onClick={submitScores}
                  disabled={
                    total === 0 ||
                    total < 3 ||
                    alreadyEvaluated ||
                    submitting ||
                    checkingEvaluation
                  }
                  className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-500 px-5 text-sm font-medium text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />

                      Submitting...
                    </>
                  ) : alreadyEvaluated ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" />

                      Evaluation Submitted
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />

                      Submit Evaluation
                    </>
                  )}
                </button>
              </div>

              {/* Success */}
              {submitted && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  className="mt-4 flex items-center gap-3 rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-4"
                >
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />

                  <div>
                    <p className="text-sm font-medium text-emerald-300">
                      Evaluation submitted
                    </p>

                    <p className="mt-0.5 text-xs text-white/35">
                      {selectedTeam.name} received a score of{" "}
                      {total}/30.
                    </p>
                  </div>
                </motion.div>
              )}
            </section>

            {/* Summary */}
            <section className="grid gap-3 sm:grid-cols-3">
              <SummaryCard
                icon={
                  <Sparkles className="h-4 w-4" />
                }
                label="Innovation"
                value={`${scores.innovation}/10`}
              />

              <SummaryCard
                icon={
                  <Code2 className="h-4 w-4" />
                }
                label="Code Quality"
                value={`${scores.codeQuality}/10`}
              />

              <SummaryCard
                icon={
                  <Presentation className="h-4 w-4" />
                }
                label="Presentation"
                value={`${scores.presentation}/10`}
              />
            </section>

            {/* Overall */}
            <section className="rounded-3xl border border-indigo-400/20 bg-indigo-500/[0.06] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-indigo-300/70">
                    <Trophy className="h-4 w-4" />

                    Evaluation score
                  </div>

                  <p className="mt-2 text-sm text-white/40">
                    Average score across all judging criteria.
                  </p>
                </div>

                <div className="text-right">
                  <div className="font-mono text-3xl font-semibold">
                    {average}
                  </div>

                  <div className="text-[10px] uppercase tracking-wider text-white/25">
                    / 10
                  </div>
                </div>
              </div>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/5">
                <motion.div
                  className="h-full rounded-full bg-indigo-500"
                  animate={{
                    width: `${(total / 30) * 100}%`,
                  }}
                  transition={{
                    duration: 0.4,
                  }}
                />
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

/* =========================================================
   SUMMARY CARD
========================================================= */

function SummaryCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
      <div className="flex items-center gap-2 text-white/30">
        {icon}

        <span className="text-[10px] uppercase tracking-wider">
          {label}
        </span>
      </div>

      <div className="mt-3 font-mono text-xl font-semibold">
        {value}
      </div>
    </div>
  );
}