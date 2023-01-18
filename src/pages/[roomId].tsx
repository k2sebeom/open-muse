import { Grid } from '@mui/material';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import Header from '../components/Header';
import Profile from '../components/Profile';
import RoundButton from '../components/RoundButton';
import { BASE_URL, getRoom, joinRoom } from '../lib/api';

import dynamic from 'next/dynamic';
import MuxPlayer from '@mux/mux-player-react';
const AudioCall = dynamic(import('../components/AudioCall'), { ssr: false });
import { Room } from '../@types/rooms';
import Head from 'next/head';

type StageProps = {
  performer: string | null;
};

const Stage = ({ performer }: StageProps) => {
  return (
    <>
      <div className="stage">
        {!performer ? null : <Profile name={performer} />}
      </div>

      <style jsx>{`
        .stage {
          width: 50%;
          height: 20vh;
          background-color: gray;
          box-shadow: 10px 5px 5px black;

          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </>
  );
};

type AudienceProps = {
  members: string[];
  performer: string | null;
};

const Audience = ({ members, performer }: AudienceProps) => {
  return (
    <>
      <Grid
        sx={{
          pt: 10,
          px: '10%',
        }}
        container
        spacing={{ xs: 20, md: 20 }}
        columns={{ xs: 3, sm: 5, md: 20 }}
      >
        {members
          .filter((username) => username !== performer)
          .map((username, i) => (
            <Grid item xs={1} md={2} key={`audience-${i}`}>
              <Profile name={username} />
            </Grid>
          ))}
      </Grid>
    </>
  );
};

type RoomPageProps = {
  title: string;
  description: string;
};

const RoomPage: NextPage<RoomPageProps> = ({
  title,
  description,
}: RoomPageProps) => {
  const router = useRouter();

  const { roomId, pw } = router.query;
  const [username, setUsername] = useState<string>('');

  const [members, setMembers] = useState<string[]>([]);

  const socket = useRef<Socket | null>(null);
  const studioSocket = useRef<Socket | null>(null);

  const [isMuted, setIsMuted] = useState<boolean>(true);

  const [phase, setPhase] = useState<'READY' | 'PERFORMING' | 'CHATTING'>(
    'CHATTING'
  );
  const [playUrl, setPlayUrl] = useState<string>('');
  const [performer, setPerformer] = useState<string | null>(null);
  const [isStudio, setIsStudio] = useState<boolean>(false);

  const [room, setRoom] = useState<Room>();

  const audioEl = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    const username = localStorage.getItem('username');
    if (!username) {
      router.replace('/');
      return;
    }
    setUsername(username);

    const email = localStorage.getItem('email');
    if (!email) {
      router.replace('/');
      return;
    }
  }, [router.isReady, setUsername]);

  useEffect(() => {
    if (roomId && username) {
      joinRoom(roomId as string, username, pw as string).then(async (data) => {
        if (!data.data) {
          alert('This is a private room!');
          router.replace('/rooms');
        } else {
          setRoom(data.data);
        }
      });
    }
  }, [router.isReady, username, setRoom]);

  // const connectStudio = useCallback(())

  // Studio sockets
  const onStudioConnect = useCallback(() => {
    if (!router.isReady) {
      return;
    }
    const email = localStorage.getItem('email');
    console.log(email);
    studioSocket.current?.emit('reqJoinDeviceCh', {
      email,
      deviceType: 'ios',
    });
  }, [router.isReady, studioSocket]);

  const onStudioJoin = useCallback(
    (data: any) => {
      console.log(data);
      if (data.deviceType === 'macos') {
        studioSocket.current?.emit('reqConnect', {});
        setIsStudio(true);
      }
    },
    [setIsStudio, studioSocket.current]
  );

  const onStudioLeft = useCallback(
    (data: any) => {
      console.log(data);
      setIsStudio(false);
    },
    [setIsStudio]
  );

  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    if (!studioSocket.current) {
      studioSocket.current = io(BASE_URL + '/studio');
    }
    studioSocket.current.on('connect', onStudioConnect);
    return () => {
      studioSocket.current?.off('connect', onStudioConnect);
    };
  }, [socket, onStudioConnect, router.isReady]);

  useEffect(() => {
    studioSocket.current?.on('recJoinDeviceCh', onStudioJoin);
    studioSocket.current?.on('recHealthCheck', onStudioJoin);
    studioSocket.current?.on('recLeaveDeviceCh', onStudioLeft);

    return () => {
      studioSocket.current?.off('recJoinDeviceCh', onStudioJoin);
      studioSocket.current?.off('recHealthCheck', onStudioJoin);
      studioSocket.current?.off('recLeaveDeviceCh', onStudioLeft);
    };
  }, [studioSocket.current, onStudioJoin, onStudioLeft]);

  // Socket Callbacks
  const onMember = useCallback(
    (data: any) => {
      console.log(data);
      setMembers(data.members);
      console.log('socket members');
    },
    [setMembers]
  );

  const onStatus = useCallback(
    (data: any) => {
      console.log(data);
      console.log(phase);
      if (phase === data.status) {
        return;
      }
      setPhase(data.status);
      if (data.status === 'PERFORMING') {
        setPlayUrl(data.playUrl);
        if (!performer) {
          setPerformer(data.performer);
        }
      } else if (data.status === 'CHATTING') {
        if(phase === 'READY') {
          setPerformer(null);
          setPlayUrl('');
        }
      } else if(data.status === 'READY' ) {
        if(!performer) {
          setPerformer(data.performer);
        }
      }
    },
    [
      phase,
      username,
      performer,
      room,
      setPhase,
      setPlayUrl,
      setPerformer,
      audioEl.current,
    ]
  );

  const onPerform = useCallback(
    (data: any) => {
      console.log(data);
      setPerformer(data.performer);
      setPhase('READY');
    },
    [setPerformer, setPhase]
  );

  // Join Channel on Connect
  const onConnect = useCallback(() => {
    console.log('Socket Connected');
    socket.current?.emit('join', {
      id: roomId,
      username,
    });
    console.log('Emiting join');
  }, [socket, username, router.isReady]);

  useEffect(() => {
    if (socket.current) {
      console.log('Setting handlers for real');
      socket.current.on('members', onMember);
      socket.current.on('join', onMember);
      socket.current.on('leave', onMember);
      socket.current.on('status', onStatus);
      socket.current.on('perform', onPerform);
    }

    return () => {
      if (socket.current) {
        console.log('Clearning socket e handler');
        socket.current.off('members', onMember);
        socket.current.off('join', onMember);
        socket.current.off('leave', onMember);
        socket.current.off('status', onStatus);
        socket.current.off('perform', onPerform);
      }
    };
  }, [socket.current, onMember, onStatus, onPerform]);

  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    if (!socket.current) {
      console.log('Socket connecting');
      socket.current = io(BASE_URL);
    }
    socket.current.on('connect', onConnect);
    return () => {
      socket.current?.off('connect', onConnect);
    };
  }, [socket, onConnect, router.isReady]);

  useEffect(() => {
    const onPageChange = () => {
      studioSocket.current?.disconnect();
      socket.current?.disconnect();
      audioEl.current?.pause();
      setPlayUrl('');
    };
    router.events.on('routeChangeStart', onPageChange);
    return () => {
      router.events.off('routeChangeStart', onPageChange);
    };
  }, []);

  return (
    <div>
      <Head>
        <title>{`${title} - OpenMuse`}</title>
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta
          property="og:image"
          content="https://uploads-ssl.webflow.com/62e9c64d4b368567d3527841/630058482da10f931a5b50d1_Screen%20Shot%202022-08-19%20at%2011.40.44%20PM-p-1600.png"
        />
      </Head>

      <Header username={username} />
      <Stage performer={performer} />
      <Audience members={members} performer={performer} />

      <div
        className="light"
        style={{
          opacity: phase === 'READY' ? 0.8 : 0,
        }}
      ></div>

      <MuxPlayer
        volume={performer === username ? 0 : 1}
        autoPlay={true}
        playbackId={playUrl}
        streamType='ll-live'
        onEnded={() => {
          setPerformer('');
          setPhase('CHATTING');
          setPlayUrl('');
        }}
        style={{
          visibility: 'hidden'
        }}
      />

      <div className="controls">
        <AudioCall
          room={room}
          username={username}
          isMuted={isMuted}
          isEnabled={!performer}
          setIsMuted={setIsMuted}
        />
        {!performer && isStudio ? (
          <RoundButton
            onClick={() => {
              socket.current?.emit('perform', {
                username,
              });
              studioSocket.current?.emit('reqStream', {
                streamKey: room?.streamKey,
              });
              setPerformer(username);
              setPhase('READY');
            }}
            title="Go on Stage"
          />
        ) : phase === 'PERFORMING' && username === performer ? (
          <RoundButton
            onClick={() => {
              setPhase('CHATTING');
              studioSocket.current?.emit('reqStreamEnded', {});
            }}
            title="Leave Stage"
          />
        ) : null}
      </div>

      <style jsx>{`
        div {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .controls {
          position: fixed;
          bottom: 20px;
        }

        .light {
          background-color: #000;
          width: 100vw;
          height: 100vh;
          position: fixed;
          top: 60px;
          left: 0;
        }
      `}</style>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<RoomPageProps> = async (
  context
) => {
  const { roomId } = context.query;
  const { data: room } = await getRoom(roomId as string);

  if (room) {
    return {
      props: {
        title: room.title,
        description: room.description,
      },
    };
  } else {
    return {
      notFound: true,
    };
  }
};

export default RoomPage;
