import React, { useEffect, useRef } from 'react';
import { Room } from '../@types/rooms';
import RtcClient from '../utils/rtc';
import RoundButton from './RoundButton';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';

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

  useEffect(() => {
    rtcClient.current.setMuted(isMuted);
    console.log('Setting enabled');
  }, [isMuted]);

  useEffect(() => {
    rtcClient.current.setEnabled(isEnabled);
    console.log('Setting enabled');
  }, [isEnabled]);

  useEffect(() => {
    console.log(room);
    if (!room) {
    } else {
      console.log('Joining');
      if (room.rtcToken) {
        rtcClient.current.join(`${room.id}`, room.rtcToken, username);
      }
    }
  }, [room]);

  useEffect(() => {
    return () => {
      console.log('Unmount');
      rtcClient.current.disconnect();
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
