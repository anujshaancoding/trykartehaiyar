import { Inter, Inter_Tight, JetBrains_Mono, Instrument_Serif } from 'next/font/google'
import ErrorBoundary from '@/components/ErrorBoundary'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-main',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

const interTight = Inter_Tight({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['300', '400', '500', '600'],
  display: 'swap',
})

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  variable: '--font-serif',
  weight: ['400'],
  style: ['normal', 'italic'],
  display: 'swap',
})

export const viewport = {
  themeColor: '#6366f1',
}

export const metadata = {
  title: 'Try Karte Hai Yar',
  description: 'Your personal motivation and habit tracking dashboard. Transform your life with daily habits, goals, and inspiring content.',
  metadataBase: new URL('https://trykartehain.com'),
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'TKHY',
  },
  openGraph: {
    title: 'Try Karte Hai Yar - Transform Your Life',
    description: 'Your personal motivation and habit tracking dashboard. Build better habits, track your goals, and join a community of achievers.',
    url: 'https://trykartehain.com',
    siteName: 'TKHY',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Try Karte Hai Yar - Transform Your Life',
    description: 'Your personal motivation and habit tracking dashboard. Build better habits, track your goals, and join a community of achievers.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/apple-touch-icon.svg',
  },
}

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${interTight.variable} ${jetbrainsMono.variable} ${instrumentSerif.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme') || 'dark';
                  document.documentElement.setAttribute('data-theme', theme);
                  if (localStorage.getItem('ambientMode') === 'true') {
                    document.documentElement.classList.add('ambient-mode');
                  }
                  if (localStorage.getItem('ultraLargeMode') === 'true') {
                    document.documentElement.classList.add('ultra-large-mode');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body><ErrorBoundary>{children}</ErrorBoundary></body>
    </html>
  )
}
