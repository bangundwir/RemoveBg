import './globals.css'
import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '600', '700'] })

export const metadata: Metadata = {
  title: 'Background Removal Tool',
  description: 'Remove background from images easily with our advanced AI tool',
  keywords: 'background removal, image editing, AI, photo editing',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${poppins.className} bg-gray-900 text-white`}>{children}</body>
    </html>
  )
}