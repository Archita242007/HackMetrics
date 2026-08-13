"use client";

import { FormEvent, useState } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (loading) return;

    setError("");
    setLoading(true);

    try {
      /*
       * STEP 1
       * Sign in using Firebase Authentication.
       */
      const credential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      const user = credential.user;

      /*
       * STEP 2
       * Get the user's profile from Firestore.
       *
       * users
       *   └── USER_UID
       *        email
       *        role
       */
      const userRef = doc(db, "users", user.uid);

      const userSnapshot = await getDoc(userRef);

      /*
       * STEP 3
       * Make sure a profile exists.
       */
      if (!userSnapshot.exists()) {
        await signOut(auth);

        setError(
          "Your account is not configured for HackMetrics. Please contact the organizer."
        );

        return;
      }

      const userData = userSnapshot.data();

      /*
       * STEP 4
       * Redirect based on role.
       */
      if (userData.role === "admin") {
        window.location.replace("/admin");
        return;
      }

      if (userData.role === "judge") {
        window.location.replace("/judge");
        return;
      }

      /*
       * STEP 5
       * Unknown role.
       */
      await signOut(auth);

      setError(
        "Invalid account role. Please contact the organizer."
      );
    } catch (error: any) {
      console.error("Login error:", error);

      const code = error?.code;

      if (
        code === "auth/invalid-credential" ||
        code === "auth/invalid-login-credentials"
      ) {
        setError("Invalid email or password.");
      } else if (code === "auth/user-not-found") {
        setError("No account exists with this email.");
      } else if (code === "auth/wrong-password") {
        setError("Incorrect password.");
      } else if (code === "auth/too-many-requests") {
        setError(
          "Too many login attempts. Please wait and try again."
        );
      } else if (code === "permission-denied") {
        setError(
          "Permission denied while checking your account role."
        );
      } else {
        setError(
          "Unable to sign in. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#05070d] text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.18),transparent_40%)]" />

        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* Login container */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-6">
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
          }}
          className="w-full max-w-md"
        >
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-400/20 bg-indigo-500/10">
              <ShieldCheck className="h-6 w-6 text-indigo-300" />
            </div>

            <p className="text-xs uppercase tracking-[0.25em] text-indigo-300">
              HACK
              <span className="text-white">
                METRICS
              </span>
            </p>

            <h1 className="mt-3 text-3xl font-semibold">
              Login
            </h1>

            <p className="mt-2 text-sm text-white/40">
              Sign in to access the HackMetrics portal.
            </p>
          </div>

          {/* Login form */}
          <form
            onSubmit={handleLogin}
            className="rounded-3xl border border-white/10 bg-white/[0.025] p-7 shadow-2xl"
          >
            {/* Email */}
            <div>
              <label className="mb-2 block text-xs uppercase tracking-wider text-white/40">
                Email
              </label>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />

                <input
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="Enter your email"
                  required
                  autoComplete="email"
                  className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.03] pl-11 pr-4 text-sm text-white outline-none transition focus:border-indigo-400/40 focus:bg-white/[0.05]"
                />
              </div>
            </div>

            {/* Password */}
            <div className="mt-5">
              <label className="mb-2 block text-xs uppercase tracking-wider text-white/40">
                Password
              </label>

              <div className="relative">
                <LockKeyhole className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />

                <input
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.03] pl-11 pr-4 text-sm text-white outline-none transition focus:border-indigo-400/40 focus:bg-white/[0.05]"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mt-5 flex items-start gap-3 rounded-xl border border-red-400/20 bg-red-400/5 p-3 text-sm text-red-300">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

                <span>{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 text-sm font-medium text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                "Signing in..."
              ) : (
                <>
                  Sign in
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-5 text-center text-xs text-white/20">
            HackMetrics Evaluation Portal
          </p>
        </motion.div>
      </div>
    </main>
  );
}