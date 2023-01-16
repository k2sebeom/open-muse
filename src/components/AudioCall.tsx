import React, { useRef } from "react";
import RtcClient from "../utils/rtc";


const AudioCall = () => {
    const rtcClient = useRef<RtcClient>(new RtcClient());

    return (
        <div></div>
    )
}


export default AudioCall;