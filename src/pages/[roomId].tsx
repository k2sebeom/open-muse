import { Grid } from "@mui/material";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import Header from "../components/Header";
import Profile from "../components/Profile";
import RoundButton from "../components/RoundButton";
import { BASE_URL, joinRoom } from "../lib/api";
import RtcClient from "../utils/rtc";

import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';

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
    members: string[]
}

const Audience = ({members }: AudienceProps) => {
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
                    
                    members.map((username, i) => ((
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


    useEffect(() => {
        const username = localStorage.getItem('username');
        console.log(router.query);
        if(!username) {
            router.replace('/');
            return;
        }
        setUsername(username);

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

                socket.current?.emit('join', {
                    id: roomId,
                    username
                });
            })
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
                }
            });
        }
    }, []);

    return (
        <div>
            <Header username={username} />
            <Stage performer={performer} />
            <Audience members={members} />

            <div className="light" style={{
                opacity: phase=='READY' ? 0.7 : 0
            }}>
            </div>

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
                <RoundButton title='Go on Stage' />
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