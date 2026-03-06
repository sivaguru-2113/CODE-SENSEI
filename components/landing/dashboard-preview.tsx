import React from "react"
import { Dashboard } from "./Dashboard"
import { CodeAnalysisResult } from "../frontend/hooks/useCodeAnalysis"

interface DashboardPreviewProps {
  results?: CodeAnalysisResult[]
}

export function DashboardPreview({ results = [] }: DashboardPreviewProps) {
  return (
    <section className="w-full py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-6 max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            See CODE‑SENSEI in action
          </h2>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            A preview of the kinds of insights you&apos;ll see as you run
            analyses across your codebase.
          </p>
        </div>
        <div className="overflow-hidden rounded-2xl border bg-gradient-to-br from-slate-950 to-slate-900 shadow-xl">
          <Dashboard results={results} />
        </div>
      </div>
    </section>
  )
}

