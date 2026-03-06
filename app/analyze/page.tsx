'use client'

import React, { Suspense } from 'react'
import { DashboardLayout } from '@/components/DashboardLayout'
import { CodeEditorPanel } from '@/components/CodeEditor'

export default function AnalyzePage() {
  return (
    <DashboardLayout>
      <Suspense fallback={
        <div className="flex h-full items-center justify-center text-slate-400 text-sm">
          <div className="w-6 h-6 border-2 border-[#00d4ff] border-t-transparent rounded-full animate-spin mr-3" />
          Loading workspace...
        </div>
      }>
        <CodeEditorPanel />
      </Suspense>
    </DashboardLayout>
  )
}
