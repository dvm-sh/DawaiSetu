import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FileQuestion, ArrowRight, LayoutDashboard, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-8 shadow-sm text-center space-y-6">
        <div className="w-14 h-14 bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 rounded-full flex items-center justify-center mx-auto text-teal-600">
          <FileQuestion className="h-7 w-7" />
        </div>

        <div>
          <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/50 px-2 py-0.5 rounded border border-teal-200 dark:border-teal-800">
            HTTP 404 - Not Found
          </span>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-3">
            Requested Resource Unreachable
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
            The medicine consignment, organizational registry, or platform endpoint you requested does not exist or has been archived.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link href="/dashboard">
            <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold">
              <LayoutDashboard className="h-3.5 w-3.5 mr-1" />
              Unified Dashboard
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="w-full text-xs">
              <Home className="h-3.5 w-3.5 mr-1" />
              Portal Homepage
            </Button>
          </Link>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
          Need verification assistance? Contact <Link href="/contact" className="underline hover:text-teal-600">Compliance Desk</Link>.
        </div>
      </div>
    </div>
  )
}
