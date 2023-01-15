import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import InputField from '../components/InputField';
import Logo from '../components/Logo';
import RoundButton from '../components/RoundButton';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  const router = useRouter();

  return (
    <div className={styles.fullwindow}>
      <Head>
        <title>OpenMuse | Home</title>
        <meta name="description" content="Live Performance with OpenMuse" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="center">
        <Logo />
        <p>Join Now</p>
        <InputField placeholder="email" />
        <InputField placeholder="nickname" />

        <RoundButton
          title="Enter"
          backgroundColor="#6700FF"
          width={250}
          onClick={() => {
            router.push('/rooms');
          }}
        />
      </div>
      <style jsx>{`
        * {
          margin-top: 30px;
          margin-bottom: 30px;
        }

        .center {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        @media (max-width: 500px) {
          .center {
            width: 85%;
          }
        }

        p {
          font-size: 22px;
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default Home;
