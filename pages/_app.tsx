import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { Analytics } from '@vercel/analytics/react';

function MyApp({ Component, pageProps }: AppProps) {
  return <>
    <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
        />
        <meta name="description" content="Description" />
        <meta name="keywords" content="Keywords" />
        <title>Watttime</title>

        <link rel="manifest" href="/manifest.json" />
        <link
          href="/icons/watttime-icon-16x16.png"
          rel="icon"
          type="image/png"
          sizes="16x16"
        />
        <link
          href="/icons/watttime-icon-32x32.png"
          rel="icon"
          type="image/png"
          sizes="32x32"
        />
        <link rel="apple-touch-icon" href="/apple-icon.png"></link>
        <meta name="theme-color" content="#232226" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black"/>
        <link rel="stylesheet" href="https://use.typekit.net/ubj3mvr.css" />
      </Head>
      <Component {...pageProps} />
      <Analytics />
  </>
}

export default MyApp
