"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  mode: "login" | "setup";
  next: string;
};

export function AuthForm({ mode, next }: Props) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    const form = new FormData(event.currentTarget);
    const payload =
      mode === "setup"
        ? {
            name: String(form.get("name") ?? ""),
            email: String(form.get("email") ?? ""),
            password: String(form.get("password") ?? ""),
          }
        : {
            email: String(form.get("email") ?? ""),
            password: String(form.get("password") ?? ""),
          };

    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Something went wrong");
        setPending(false);
        return;
      }
      router.replace(next.startsWith("/admin") ? next : "/admin");
      router.refresh();
    } catch {
      setError("Network error — please try again");
      setPending(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none transition focus:border-amber-300/40 focus:bg-white/10";

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      {mode === "setup" ? (
        <div>
          <label className="mb-1.5 block text-xs text-slate-400" htmlFor="name">
            Your name
          </label>
          <input
            autoComplete="name"
            className={inputClass}
            id="name"
            name="name"
            required
            type="text"
          />
        </div>
      ) : null}

      <div>
        <label className="mb-1.5 block text-xs text-slate-400" htmlFor="email">
          Email
        </label>
        <input
          autoComplete="email"
          className={inputClass}
          id="email"
          name="email"
          required
          type="email"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs text-slate-400" htmlFor="password">
          Password
        </label>
        <input
          autoComplete={mode === "setup" ? "new-password" : "current-password"}
          className={inputClass}
          id="password"
          minLength={mode === "setup" ? 8 : undefined}
          name="password"
          required
          type="password"
        />
      </div>

      {error ? (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </p>
      ) : null}

      <button
        className="w-full rounded-full bg-amber-300 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-amber-200 disabled:opacity-60"
        disabled={pending}
        type="submit"
      >
        {pending
          ? "Please wait…"
          : mode === "setup"
            ? "Create admin & continue"
            : "Sign in"}
      </button>
    </form>
  );
}
