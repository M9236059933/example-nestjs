import { Sofia_Sans, Grenze_Gotisch } from "next/font/google";
import type { AppProps } from "next/app";
import type { NextPageWithLayout } from "../types/next";
import Layout from "../components/Layout";
import "../styles/globals.css";

const sofiaSans = Sofia_Sans({
  subsets: ["latin"],
  variable: "--font-sofia-sans",
  display: "swap",
});

const grenzeGotisch = Grenze_Gotisch({
  subsets: ["latin"],
  variable: "--font-grenze-gotisch",
  display: "swap",
});

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const shouldUseLayout = !Component.noLayout;

  if (shouldUseLayout) {
    return (
      <Layout>
        <main className={`${sofiaSans.variable} ${grenzeGotisch.variable}`}>
          <Component {...pageProps} />
        </main>
      </Layout>
    );
  }
  return (
    <main className={`${sofiaSans.variable} ${grenzeGotisch.variable}`}>
      <Component {...pageProps} />
    </main>
  );
}

export default MyApp;
