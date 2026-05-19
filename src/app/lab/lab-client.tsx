"use client";

import { useState } from "react";
import { CommandCenterScene } from "@/components/command-center-scene";
import { CrmMarketingModule } from "@/components/modules/CrmMarketingModule";
import { DocSecurityModule } from "@/components/modules/DocSecurityModule";
import { RecruitmentModule } from "@/components/modules/RecruitmentModule";
import { WhatsappModule } from "@/components/modules/WhatsappModule";
import { WorkforceModule } from "@/components/modules/WorkforceModule";
import { SceneRoot } from "@/components/scene/SceneRoot";
import { SERVICE_MODULES } from "@/lib/services-config";

type Tab = "command" | "modules";

const MODULE_LIST = [
  { slug: "whatsapp-automation", Component: WhatsappModule },
  { slug: "recruitment-hr-automation", Component: RecruitmentModule },
  { slug: "crm-ai-marketing-automation", Component: CrmMarketingModule },
  { slug: "document-verification-security-automation", Component: DocSecurityModule },
  { slug: "workforce-operations-tracking", Component: WorkforceModule },
] as const;

export function LabClient() {
  const [tab, setTab] = useState<Tab>("command");
  const [focusedSlug, setFocusedSlug] = useState<string | null>(null);

  return (
    <main className="relative min-h-screen overflow-hidden">
      {tab === "command" ? (
        <div className="absolute inset-0">
          <SceneRoot cameraPosition={[0, 0.6, 7]} fov={42}>
            <CommandCenterScene focusedSlug={focusedSlug} />
          </SceneRoot>
        </div>
      ) : null}

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10">
        <header className="flex items-center justify-between gap-4">
          <div>
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-cyan-200/80">
              Summit Lab
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
              {tab === "command" ? "Automation Command Center" : "Service Modules"}
            </h1>
          </div>
          <div className="flex gap-2 rounded-full border border-white/10 bg-white/5 p-1">
            {(["command", "modules"] as const).map((t) => (
              <button
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  tab === t ? "bg-white/15 text-white" : "text-white/60 hover:text-white"
                }`}
                key={t}
                onClick={() => setTab(t)}
                type="button"
              >
                {t === "command" ? "Command Center" : "Modules"}
              </button>
            ))}
          </div>
        </header>

        {tab === "command" ? (
          <>
            <div className="flex flex-wrap gap-3">
              {SERVICE_MODULES.map((module) => {
                const isFocused = focusedSlug === module.slug;
                return (
                  <button
                    className="glass-card pointer-events-auto cursor-pointer px-4 py-3 text-left transition-transform hover:-translate-y-1"
                    data-accent={module.accent}
                    key={module.slug}
                    onClick={() => setFocusedSlug(isFocused ? null : module.slug)}
                    style={{
                      borderRadius: "1.25rem",
                      opacity: focusedSlug && !isFocused ? 0.5 : 1,
                    }}
                    type="button"
                  >
                    <p className="font-mono text-[0.65rem] uppercase tracking-[0.22em] text-white/60">
                      {module.accent}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-white">{module.shortName}</p>
                    <p className="mt-1 text-xs text-white/60">{module.tagline}</p>
                  </button>
                );
              })}
            </div>
            <p className="max-w-2xl text-sm leading-6 text-white/60">
              Hover the modules in the scene, or click a chip to lock focus. Beams brighten, the
              orb lifts, and packet density increases on the active service.
            </p>
          </>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {MODULE_LIST.map(({ slug, Component }) => {
              const svc = SERVICE_MODULES.find((m) => m.slug === slug);
              if (!svc) return null;
              return (
                <div
                  className="glass-card overflow-hidden"
                  data-accent={svc.accent}
                  key={slug}
                  style={{ borderRadius: "1.25rem" }}
                >
                  <div className="aspect-[4/3] w-full">
                    <SceneRoot
                      bloomIntensity={0.6}
                      cameraPosition={[0, 0.2, 5.6]}
                      fov={40}
                    >
                      <Component scale={1.05} />
                    </SceneRoot>
                  </div>
                  <div className="px-4 py-4">
                    <p className="font-mono text-[0.65rem] uppercase tracking-[0.22em] text-white/60">
                      {svc.accent}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-white">{svc.shortName}</p>
                    <p className="mt-1 text-xs text-white/60">{svc.tagline}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
