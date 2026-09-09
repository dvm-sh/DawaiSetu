'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AlertOctagon, RotateCcw } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex items-center justify-center p-6 bg-slate-900 text-white font-sans antialiased">
        <div className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-lg p-8 shadow-xl text-center space-y-6">
          <div className="w-14 h-14 bg-red-950 border border-red-800 rounded-full flex items-center justify-center mx-auto text-red-500">
            <AlertOctagon className="h-7 w-7" />
          </div>

          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-red-400 font-bold block">
              CRITICAL SUBSYSTEM FAILURE
            </span>
            <h1 className="text-xl font-bold text-white mt-2">
              DawaiSetu Portal Recovery
            </h1>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              A root application fault was captured. Data state has been preserved. Please reset the runtime session.
            </p>
            {error.digest && (
              <p className="text-[10px] font-mono text-slate-500 mt-2">
                Trace ID: {error.digest}
              </p>
            )}
          </div>

          <div className="flex gap-3 justify-center pt-2">
            <Button
              onClick={() => reset()}
              className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold"
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1" />
              Reset Application Runtime
            </Button>
          </div>
        </div>
      </body>
    </html>
  )
}
