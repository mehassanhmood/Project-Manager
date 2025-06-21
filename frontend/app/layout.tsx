import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AppSidebar } from './componentsCust/app-sidebar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Buraq Manager',
  description: 'Trading & Portfolio Management System',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppSidebar>
          {children}
        </AppSidebar>
      </body>
    </html>
  )
} 