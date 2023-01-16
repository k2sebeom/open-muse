import { Grid } from '@mui/material';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import Header from '../components/Header';
import Profile from '../components/Profile';
import RoundButton from '../components/RoundButton';
import { BASE_URL, joinRoom } from '../lib/api';

import dynamic from 'next/dynamic';
const ReactHlsPlayer = dynamic(import('react-hls-player/dist'), { ssr: false });
const AudioCall = dynamic(import('../components/AudioCall'), { ssr: false });
import { Room } from '../@types/rooms';

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

const RoomPage: NextPage = () => {
  const router = useRouter();

  const { roomId, pw } = router.query;
  const [username, setUsername] = useState<string>('');

  const [members, setMembers] = useState<string[]>([]);

  //   const rtcClient = useRef<RtcClient>(new RtcClient());
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
    if(!router.isReady) {
      return;
    }
    const username = localStorage.getItem('username');
    console.log(router.query);
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

    if (roomId) {
      joinRoom(roomId as string, username, pw as string).then(async (data) => {
        if (!data.data) {
          alert('This is a private room!');
          router.replace('/rooms');
        } else {
          setRoom(data.data);
        }
      });
    }

    if (!socket.current) {
      socket.current = io(BASE_URL);

      socket.current.on('connect', () => {
        socket.current?.on('members', (data) => {
          console.log(data);
          setMembers(data.members);
        });

        socket.current?.on('join', (data) => {
          setMembers(data.members);
        });

        socket.current?.on('leave', (data) => {
          setMembers(data.members);
        });

        socket.current?.on('status', (data) => {
          if (phase === data.status) {
            return;
          }
          setPhase(data.status);
        });

        socket.current?.on('perform', (data) => {
          setPerformer(data.performer);
          setPhase('READY');
        });

        socket.current?.emit('join', {
          id: roomId,
          username,
        });
      });
    }

    if (!studioSocket.current) {
      studioSocket.current = io(BASE_URL + '/studio');

      studioSocket.current.on('connect', () => {
        studioSocket.current?.on('recJoinDeviceCh', (data) => {
          console.log(data);
          studioSocket.current?.emit('reqConnect', {});
          setIsStudio(true);
        });

        studioSocket.current?.on('recHealthCheck', (data) => {
          console.log(data);
          studioSocket.current?.emit('reqConnect', {});
          setIsStudio(true);
        });

        studioSocket.current?.on('recLeaveDeviceCh', (data) => {
          if (data.deviceType === 'macos') {
            setIsStudio(false);
          }
        });

        // Join the device channel
        studioSocket.current?.emit('reqJoinDeviceCh', {
          email,
          deviceType: 'ios',
        });
      });
    }
  }, [router.isReady]);

  useEffect(() => {
    const onPageChange = () => {
      studioSocket.current?.disconnect();
      socket.current?.disconnect();
    };
    router.events.on('routeChangeStart', onPageChange);
    return () => {
      router.events.off('routeChangeStart', onPageChange);
    };
  }, []);

  useEffect(() => {
    if (phase === 'PERFORMING') {
      console.log(username, performer);
      if (username != performer) {
        if (room) {
          setPlayUrl(room.liveUrl);
        }
        audioEl.current?.play();
      }
    } else if (phase === 'CHATTING') {
      setPerformer(null);
      setPlayUrl('');
    }
  }, [phase]);

  return (
    <div>
      <Header username={username} />
      <Stage performer={performer} />
      <Audience members={members} performer={performer} />

      <div
        className="light"
        style={{
          opacity: phase === 'READY' ? 0.8 : 0,
        }}
      ></div>

      <ReactHlsPlayer
        playerRef={audioEl}
        src={playUrl}
        autoPlay={false}
        hlsConfig={{
          defaultAudioCodec: 'mp4a.40.2',
          minAutoBitrate: 128000,
          lowLatencyMode: true,
        }}
        onEnded={() => {
          setPerformer('');
          setPhase('CHATTING');
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
          top: 0;
          left: 0;
        }
      `}</style>
    </div>
  );
};

export default RoomPage;
