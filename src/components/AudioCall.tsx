import React, { useEffect, useRef } from 'react';
import { Room } from '../@types/rooms';
import RtcClient from '../utils/rtc';
import RoundButton from './RoundButton';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import { useRouter } from 'next/router';

type AudioCallProps = {
  isMuted: boolean;
  isEnabled: boolean;
  room?: Room;
  username: string;
  setIsMuted: (muted: boolean) => void;
};

const AudioCall = ({
  isMuted,
  isEnabled,
  room,
  username,
  setIsMuted,
}: AudioCallProps) => {
  const rtcClient = useRef<RtcClient>(new RtcClient());
  const router = useRouter();

  useEffect(() => {
    rtcClient.current.setMuted(isMuted);
    console.log(`Mute: ${isMuted}`);
  }, [isMuted]);

  useEffect(() => {
    rtcClient.current.setEnabled(isEnabled);
    console.log(`Enabled ${isEnabled}`);
  }, [isEnabled]);

  useEffect(() => {
    console.log(room);
    if (!room) {
      console.log('no room');
    } else {
      console.log('Joining');
      if (room.rtcToken) {
        rtcClient.current.join(`${room.id}`, room.rtcToken, username).then(() => {
          rtcClient.current.setMuted(true);
        });
      }
    }
  }, [room]);

  useEffect(() => {
    const onPageChange = () => {
      console.log('page change');
      if (rtcClient.current.isConnected()) {
        console.log('Need to cleanup');
        rtcClient.current.disconnect();
      }
    };
    router.events.on('routeChangeStart', onPageChange);
    return () => {
      router.events.off('routeChangeStart', onPageChange);
    };
  }, []);

  return isEnabled ? (
    isMuted ? (
      <RoundButton
        backgroundColor="black"
        onClick={() => {
          setIsMuted(false);
          // rtcClient.current.setMuted(false);
        }}
        width={100}
        height={50}
        title=""
      >
        <MicOffIcon />
      </RoundButton>
    ) : (
      <RoundButton
        onClick={() => {
          setIsMuted(true);
          // rtcClient.current.setMuted(true);
        }}
        width={100}
        height={50}
        title=""
      >
        <MicIcon />
      </RoundButton>
    )
  ) : null;
};

export default AudioCall;
