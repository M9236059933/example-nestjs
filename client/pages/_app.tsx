import type { AppProps } from 'next/app';
import type { NextPageWithLayout } from '../types/next';
import Layout from '../components/Layout';
import '../styles/globals.css';

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // Check if the page should use layout
  const shouldUseLayout = !Component.noLayout;

  if (shouldUseLayout) {
    return (
      <Layout>
        <Component {...pageProps} />
      </Layout>
    );
  }

  return <Component {...pageProps} />;
}

export default MyApp;
