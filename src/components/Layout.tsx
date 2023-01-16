import { LayoutProps } from '../@types/Layout.props';
import Head from 'next/head';

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />

        <title>OpenMuse | Perform at your will</title>
        <meta property="og:title" content="OpenMuse | Audio-only Musical Performance" />
        <meta property="og:description" content="Show your talents in virtual concerts" />
        <meta property="og:image" content='https://uploads-ssl.webflow.com/62e9c64d4b368567d3527841/630058482da10f931a5b50d1_Screen%20Shot%202022-08-19%20at%2011.40.44%20PM-p-1600.png' />
      </Head>
      {children}
    </>
  );
};

export default Layout;
