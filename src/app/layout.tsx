import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/context/auth-context'
import { ToastProvider } from '@/components/ui/toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'DawaiSetu - Smart Medicine Redistribution Platform',
  description: 'Connect surplus medicine donors with healthcare organizations in need. Reduce medicine waste and save lives through smart redistribution.',
  keywords: ['medicine', 'redistribution', 'donation', 'healthcare', 'pharmacy', 'hospital'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-gray-50 text-gray-900`}>
        <AuthProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
