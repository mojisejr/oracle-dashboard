import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Oracle Dashboard',
  description: 'Mobile-first orchard management dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  )
}
