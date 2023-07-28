import './globals.css'
import { Metadata } from 'next';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

export const metadata: Metadata = {
  title: 'Watttime',
  description: 'Electricity prices in Denmark',
  applicationName: "Watttime",
  manifest: 'https://watttime.dk/manifest.json',
//   generator: 'Next.js',
//   referrer: 'origin-when-cross-origin',
  keywords: ['Watttime', 'Elpris', 'Watt'],
  authors: [{ name: 'hojelse', url: 'https://hojelse.com' }],
  creator: 'Kristoffer Højelse',
  metadataBase: new URL('https://watttime.dk'),
//   alternates: {
//     canonical: '/',
//     languages: {
//       'en-US': '/en-US',
//       'da-DK': '/da-DK',
//     },
//   },
//   colorScheme: 'dark',
//   themeColor: [
//     { media: '(prefers-color-scheme: light)', color: 'cyan' },
//     { media: '(prefers-color-scheme: dark)', color: 'black' },
//   ],
//   icons: {
//     icon: [{ url: '/icon.png' }, new URL('/icon.png', 'https://example.com')],
//     shortcut: ['/shortcut-icon.png'],
//     apple: [
//       { url: '/apple-icon.png' },
//       { url: '/apple-icon-x3.png', sizes: '180x180', type: 'image/png' },
//     ],
//     other: [
//       {
//         rel: 'apple-touch-icon-precomposed',
//         url: '/apple-touch-icon-precomposed.png',
//       },
//     ],
//   },
//   openGraph: {
//     title: 'Watttime.dk',
//     description: 'Electricity prices in Denmark',
//     url: 'https://watttime.dk',
//     siteName: 'Watttime.dk',
//     images: [
//       {
//         url: 'https://watttime.dk/og.png',
//         width: 800,
//         height: 600,
//       },
//       {
//         url: 'https://watttime.dk/og-alt.png',
//         width: 1800,
//         height: 1600,
//         alt: 'My custom alt',
//       },
//     ],
//     locale: 'en_US',
//     type: 'website',
//   },
//   appleWebApp: {
//     title: 'Apple Web App',
//     statusBarStyle: 'black-translucent',
//     startupImage: [
//       '/assets/startup/apple-touch-startup-image-768x1004.png',
//       {
//         url: '/assets/startup/apple-touch-startup-image-1536x2008.png',
//         media: '(device-width: 768px) and (device-height: 1024px)',
//       },
//     ],
//   },
//   twitter: {
//     card: 'summary_large_image',
//     title: 'Watttime.dk',
//     description: 'Electricity prices in Denmark',
//     siteId: '1467726470533754880',
//     creator: '@nextjs',
//     creatorId: '1467726470533754880',
//     images: ['https://watttime.dk/og.png'],
//   },
}