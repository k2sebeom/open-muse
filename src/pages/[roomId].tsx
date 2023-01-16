import { Grid } from "@mui/material";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import Header from "../components/Header";
import Profile from "../components/Profile";
import RoundButton from "../components/RoundButton";
import { BASE_URL, getStudioToken, joinRoom } from "../lib/api";
import RtcClient from "../utils/rtc";
import ReactHlsPlayer from "react-hls-player/dist";

import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import { Room } from "../@types/rooms";

type StageProps = {
    performer: string | null
}

const Stage = ({ performer}: StageProps) => {
    return (
        <>
            <div className='stage'>
                {
                    !performer ?
                    null :
                    <Profile name={performer} />
                }
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
    )
}

type AudienceProps = {
    members: string[],
    performer: string | null
}

const Audience = ({ members , performer }: AudienceProps) => {
    return (
        <>
            <Grid
                sx={{
                    pt: 10,
                    px: '10%'
                }}
                container
                spacing={{ xs: 20, md: 20}}
                columns={{ xs: 3, sm: 5, md: 20}}    
            >
                {
                    
                    members.filter((username) => username !== performer).map((username, i) => ((
                        <Grid item xs={1} md={2} key={`audience-${i}`}>
                            <Profile name={username} />
                        </Grid>
                    )))
                }
                
            </Grid>
        </>
    )
}

const RoomPage: NextPage = () => {

    const router = useRouter();

    const { roomId, pw } = router.query;
    const [username, setUsername] = useState<string>('');

    const [members, setMembers] = useState<string[]>([]);

    const rtcClient = useRef<RtcClient>(new RtcClient());
    const socket = useRef<Socket | null>(null);

    const [isMuted, setIsMuted] = useState<boolean>(true);

    const [phase, setPhase] = useState<'READY' | 'PERFORMING' | 'CHATTING'>('CHATTING');
    const [performer, setPerformer] = useState<string | null>(null);

    const [room, setRoom] = useState<Room>();

    const audioEl = useRef<HTMLVideoElement>(null);


    useEffect(() => {
        const username = localStorage.getItem('username');
        console.log(router.query);
        if(!username) {
            router.replace('/');
            return;
        }
        setUsername(username);

        const email = localStorage.getItem('email');
        if(!email) {
            router.replace('/');
            return;
        }
        else {
            // getStudioToken(email).then(data => {
            //     console.log(data);
            // })
        }

        if(roomId) {
            joinRoom(roomId as string, username, pw as string).then(async (data) => {
                if(!data.data) {
                    alert('This is a private room!');
                    router.replace('/rooms');
                }
                else {
                    const room = data.data;
                    await rtcClient.current.join(room.id, room.rtcToken, username);
                    rtcClient.current.setMuted(isMuted);
                    setRoom(data.data);
                }
            });
        }

        if(!socket.current) {
            socket.current = io(BASE_URL);

            socket.current.on("connect", () => {
                socket.current?.on('members', (data) => {
                    console.log(data);
                    setMembers(data.members);
                });

                socket.current?.on('join', (data) => {
                    setMembers(data.members);
                })

                socket.current?.on('leave', (data) => {
                    setMembers(data.members);
                })

                socket.current?.on('status', data => {
                    if(phase === data.status) {
                        return;
                    }
                    setPhase(data.status);
                })

                socket.current?.on('perform', data => {
                    setPerformer(data.performer);
                    setPhase('READY');
                })

                socket.current?.emit('join', {
                    id: roomId,
                    username
                });
            })
        }
    }, []);


    useEffect(() => {
        if(phase === 'PERFORMING') {
            console.log(username, performer);
            if(username != performer) {
                audioEl.current?.play();
            }
        }
        else if(phase === 'CHATTING') {
            setPerformer(null);
        }
    }, [phase]);

    return (
        <div>
            <Header username={username} />
            <Stage performer={performer} />
            <Audience members={members} performer={performer} />

            <div className="light" style={{
                opacity: phase==='READY' ? 0.8 : 0
            }}>
            </div>
            <ReactHlsPlayer 
                playerRef={audioEl}
                src={room ? room.liveUrl : ''}
                autoPlay={false}
                hlsConfig={{
                    defaultAudioCodec: 'mp4a.40.2',
                    minAutoBitrate: 128000,
                    lowLatencyMode: true
                }}
                onEnded={() => {
                    setPerformer('');
                    setPhase('CHATTING');
                }}
            />

            <div className="controls">
                {
                    isMuted ? (
                        <RoundButton backgroundColor="black" onClick={() => {
                            setIsMuted(false);
                            rtcClient.current.setMuted(false);
                        }} width={100} height={50} title="">
                            <MicOffIcon />
                        </RoundButton>
                    ) : (
                        <RoundButton onClick={() => {
                            setIsMuted(true);
                            rtcClient.current.setMuted(true);
                        }} width={100} height={50} title="">
                            <MicIcon />
                        </RoundButton>
                    )
                }
                <RoundButton onClick={() => {
                    socket.current?.emit('perform', {
                        username
                    });
                    setPerformer(username);
                    setPhase('READY');
                }} title='Go on Stage' />
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
    )
}


export default RoomPage;