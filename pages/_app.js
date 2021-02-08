import "../styles/main.css";
import Head from "next/head";
import { ThemeProvider } from "next-themes";
import DarkMode from "../components/dark-mode";

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider attribute="class">
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  );
}

export default MyApp;

const Layout = ({ children }) => {
  return (
    <>
      <Head>
        <link rel="manifest" href="/site.webmanifest" />
        <link
          rel="icon"
          type="image/png"
          sizes="196x196"
          href="icons/favicon-196.png"
        />
        <link rel="apple-touch-icon" href="icons/apple-icon-180.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="viewport" content="initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#ffffff" />
      </Head>

      <main className="antialiased text-gray-800 bg-blue-200 dark:text-white dark:bg-gray-600">
        {children}
      </main>
      <DarkMode />
    </>
  );
};
