import React, { useEffect, useRef } from "react";
import { Room } from "../@types/rooms";
import RtcClient from "../utils/rtc";


type AudioCallProps = {
  isMuted: boolean,
  isEnabled: boolean,
  room?: Room,
  username: string
};

const AudioCall = ({ isMuted, isEnabled, room, username }: AudioCallProps) => {
    const rtcClient = useRef<RtcClient>(new RtcClient());

    useEffect(() => {
      rtcClient.current.setMuted(isMuted);
      console.log("Setting enabled");
    }, [isMuted]);

    useEffect(() => {
      rtcClient.current.setEnabled(isEnabled);
      console.log("Setting enabled");
    }, [isEnabled]);

    useEffect(() => {
      console.log(room);
      if(!room) {
        
      }
      else {
        console.log('Joining');
        if(room.rtcToken) {
          rtcClient.current.join(`${room.id}`, room.rtcToken, username);
        }
      }
    }, [room]);

    return (
        <div></div>
    )
}


export default AudioCall;