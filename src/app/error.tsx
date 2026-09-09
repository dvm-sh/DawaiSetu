'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RotateCcw, Home, LayoutDashboard } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('System Exception Encountered:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-8 shadow-sm text-center space-y-6">
        <div className="w-14 h-14 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900 rounded-full flex items-center justify-center mx-auto text-red-600">
          <AlertTriangle className="h-7 w-7" />
        </div>

        <div>
          <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-red-600 bg-red-50 dark:bg-red-950/50 px-2 py-0.5 rounded border border-red-200 dark:border-red-900">
            System Fault Intercepted
          </span>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-3">
            An Unexpected Platform Error Occurred
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
            The requested healthcare operation could not be completed. The transaction was aborted to ensure database consistency and patient safety.
          </p>
          {error.digest && (
            <p className="text-[10px] font-mono text-slate-400 mt-2">
              Error Reference Digest: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Button
            onClick={() => reset()}
            className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1" />
            Retry Operation
          </Button>
          <Link href="/dashboard">
            <Button variant="outline" className="w-full text-xs">
              <LayoutDashboard className="h-3.5 w-3.5 mr-1" />
              Return to Dashboard
            </Button>
          </Link>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
          If this issue persists, please contact <Link href="/contact" className="underline hover:text-teal-600">Technical Support</Link>.
        </div>
      </div>
    </div>
  )
}
