import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Header from '../components/Header';
import InputField from '../components/InputField';

import RoundButton from '../components/RoundButton';
import { createRoom } from '../lib/api';

const CreatePage: NextPage = () => {
  const router = useRouter();

  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [mode, setMode] = useState<'OPEN' | 'SHOW'>('OPEN');
  const [password, setPassword] = useState<string>('');

  const [username, setUsername] = useState<string>('');

  useEffect(() => {
    const username = localStorage.getItem('username');
    if (!username) {
      router.replace('/');
    } else {
      setUsername(username);
    }
  }, []);

  return (
    <div className="background">
      <Header username={username} />

      <div className="container">
        <h1>Room Title</h1>
        <InputField value={title} onChange={setTitle} placeholder="title" />

        <h1>Room Description</h1>
        <InputField
          value={description}
          onChange={setDescription}
          placeholder="description"
        />

        <h1>Mode</h1>
        <div>
          <RoundButton
            backgroundColor={mode === 'OPEN' ? '#6700FF' : 'gray'}
            onClick={() => {
              setMode('OPEN');
            }}
            width={130}
            title="Open Mic"
          />
          <span> </span>
          <RoundButton
            backgroundColor={mode === 'SHOW' ? '#6700FF' : 'gray'}
            onClick={() => {
              setMode('SHOW');
            }}
            width={130}
            title="Show"
          />
        </div>

        <h1>{'Password (Optional)'}</h1>
        <InputField
          value={password}
          onChange={setPassword}
          placeholder="password"
        />

        <RoundButton
          width={200}
          title="Create"
          onClick={async () => {
            const room = await createRoom(title, description, mode, password);
            router.push('/rooms');
          }}
        />
      </div>

      <style jsx>{`
        .background {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        h1 {
          font-size: 26px;
          width: 100%;
          border-bottom: 1px solid black;
        }

        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 70%;
        }

        .controls {
          position: fixed;
          bottom: 20px;
        }

        .light {
          background-color: #000;
          width: 100vw;
          height: 100vh;
          position: absolute;
          top: 0;
          left: 0;
          opacity: 0.2;
        }
      `}</style>
    </div>
  );
};

export default CreatePage;
