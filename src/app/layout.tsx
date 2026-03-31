import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Oracle Dashboard',
  description: 'Oracle Ranger - เพื่อนชาวสวนจีนของคุณนนท์ ดูแลสวนด้วยหลักการ Data-First ไม่คาดเดา ไม่เติมความ อ่านข้อมูลตรงๆ',
  keywords: ['oracle ranger', 'orchard', 'farmer', 'ชาวสวน', 'data-first', 'no assumptions'],
  authors: [{ name: 'Oracle Ranger (o)' }, { name: 'Nonthasak Laoluerat' }],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th">
      <body className="antialiased">{children}</body>
    </html>
  )
}
