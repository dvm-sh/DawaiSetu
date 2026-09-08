import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/context/auth-context'
import { ToastProvider } from '@/components/ui/toast'
import { ThemeProvider } from '@/components/theme-provider'
import { FloatingQuickAction } from '@/components/layout/floating-quick-action'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'DawaiSetu - Smart Medicine Redistribution Platform',
  description: 'Connect surplus medicine donors with healthcare organizations in need. Reduce medicine waste and save lives through smart redistribution.',
  keywords: ['medicine', 'redistribution', 'donation', 'healthcare', 'pharmacy', 'hospital'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100 transition-colors duration-200 min-h-screen flex flex-col selection:bg-teal-500 selection:text-white`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <AuthProvider>
            <ToastProvider>
              <div className="flex-1 flex flex-col relative">
                {children}
              </div>
              <FloatingQuickAction />
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

