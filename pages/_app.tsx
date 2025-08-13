import type { AppProps } from 'next/app';
import Head from 'next/head';
import Layout from '../components/Layout';
import { AuthProvider } from '../lib/auth';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>TCA - Trusted Cleaners Association</title>
        <meta name="description" content="Professional cleaning services association providing training, certification, and industry standards." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Favicon */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg?v=4" />
        <link rel="apple-touch-icon" href="/favicon.svg?v=4" />
        
        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#1E88E5" />
      </Head>
      
      <AuthProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AuthProvider>
    </>
  );
}
