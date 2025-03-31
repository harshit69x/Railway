import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from "next-themes"

export const metadata: Metadata = {
  title: 'Rail Meds',
  description: 'Rail Meds - Your Railway Medicine Companion',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider attribute="class">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
