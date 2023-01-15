import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import InputField from '../components/InputField';
import Logo from '../components/Logo';
import RoundButton from '../components/RoundButton';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  const router = useRouter();

  const [email, setEmail] = useState<string>('');
  const [username, setUsername] = useState<string>('');

  useEffect(() => {
    const username = localStorage.getItem('username');
    const email = localStorage.getItem('email');
    if(username && email) {
      setEmail(email);
      setUsername(username);
    }
    localStorage.removeItem('email');   
    localStorage.removeItem('username');    
  });

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
        <InputField value={email} onChange={setEmail} placeholder="email" />
        <InputField value={username} onChange={setUsername} placeholder="nickname" />

        <RoundButton
          title="Enter"
          backgroundColor="#6700FF"
          width={250}
          onClick={() => {
            localStorage.setItem('email', email);
            localStorage.setItem('username', username);
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
