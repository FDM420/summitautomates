"use client";

import dynamic from "next/dynamic";

const LabClient = dynamic(() => import("./lab-client").then((m) => m.LabClient), {
  ssr: false,
  loading: () => (
    <main className="flex min-h-screen items-center justify-center bg-[#04060f]">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-300/70">Booting scene…</p>
    </main>
  ),
});

export function LabEntry() {
  return <LabClient />;
}
