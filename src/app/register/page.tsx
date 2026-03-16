"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";

type RegisterResponse =
  | { user: { id: string; email: string; name: string | null } }
  | { error: { message: string } };

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = (await res.json()) as RegisterResponse;

    if (!res.ok) {
      setIsSubmitting(false);
      setError("error" in data ? data.error.message : "Registration failed.");
      return;
    }

    const signInRes = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/dashboard",
    });

    setIsSubmitting(false);

    if (!signInRes?.ok) {
      setError("Account created. Please sign in.");
      return;
    }

    window.location.assign(signInRes.url ?? "/dashboard");
  }

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create account</CardTitle>
          <CardDescription>Start using SecureSub in minutes.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
                Name
              </label>
              <input
                className="h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-950 outline-none ring-zinc-950/20 focus:ring-2 dark:border-zinc-900 dark:bg-black dark:text-zinc-50 dark:ring-white/20"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
                Email
              </label>
              <input
                className="h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-950 outline-none ring-zinc-950/20 focus:ring-2 dark:border-zinc-900 dark:bg-black dark:text-zinc-50 dark:ring-white/20"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
                Password
              </label>
              <input
                className="h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-950 outline-none ring-zinc-950/20 focus:ring-2 dark:border-zinc-900 dark:bg-black dark:text-zinc-50 dark:ring-white/20"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                minLength={8}
                required
              />
              <div className="text-xs text-zinc-500 dark:text-zinc-400">
                Minimum 8 characters.
              </div>
            </div>

            {error ? (
              <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300">
                {error}
              </div>
            ) : null}

            <Button
              className="w-full"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating…" : "Create account"}
            </Button>

            <div className="text-center text-sm text-zinc-600 dark:text-zinc-400">
              Already have an account?{" "}
              <a
                className="font-medium text-zinc-950 hover:underline dark:text-zinc-50"
                href="/login"
              >
                Sign in
              </a>
              .
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

