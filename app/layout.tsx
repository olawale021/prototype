import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AssessmentProvider } from '@/context/AssessmentContext'
import { Header } from '@/components/ui/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CareerPath Advisor',
  description: 'Discover your ideal career path with our personalized assessment',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} min-h-screen`}
        style={{
          backgroundImage: 'url(/images/fht5.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <AssessmentProvider>
          <Header />
          <main className="pt-24">
            {children}
          </main>
        </AssessmentProvider>
      </body>
    </html>
  )
}
