"use client";

import dynamic from "next/dynamic";

const CommandCenterPage = dynamic(
  () => import("./command-center-page").then((module) => module.CommandCenterPage),
  {
    ssr: false,
    loading: () => (
      <main className="section-shell flex min-h-screen items-center justify-center py-24">
        <div className="panel-strong w-full max-w-xl rounded-[2rem] p-8 text-center">
          <p className="mono text-xs uppercase tracking-[0.24em] text-cyan-200/80">Summit AI Automation Services</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white">Loading the command center...</h1>
        </div>
      </main>
    ),
  },
);

export function CommandCenterEntry() {
  return <CommandCenterPage />;
}