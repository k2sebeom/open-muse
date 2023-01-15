import { Grid } from "@mui/material";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import Profile from "../components/Profile";
import RoundButton from "../components/RoundButton";
import { joinRoom } from "../lib/api";
import RtcClient from "../utils/rtc";

const Stage = () => {
    return (
        <>
            <div className='stage'>
                <Profile />
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

const Audience = () => {
    return (
        <>
            <Grid
                sx={{
                    pt: 10,
                    px: 3
                }}
                container
                spacing={{ xs: 3, md: 10}}
                columns={{ xs: 4, sm: 5, md: 20}}    
            >
                {
                    [1, 2, 3, 4,5, 6, 7, 9, 2, 2, 2, 2, 2, 2, 2].map((_, i) => ((
                        <Grid item xs={1} md={2} key={`audience-${i}`}>
                            <Profile />
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

    const rtcClient = useRef<RtcClient>(new RtcClient());

    useEffect(() => {
        const username = localStorage.getItem('username');
        console.log(router.query);
        if(!username) {
            router.replace('/');
            return;
        }
        setUsername(username);

        if(roomId) {
            joinRoom(roomId as string, username, pw as string).then(async (data) => {
                if(!data.data) {
                    alert('This is a private room!');
                    router.replace('/rooms');
                }
                else {
                    const room = data.data;
                    await rtcClient.current.join(room.id, room.rtcToken, username);
                }
            });
        }
    }, []);

    return (
        <div>
            <Header username={username} />
            <Stage />
            <Audience />

            <div className="light">
            </div>

            <div className="controls">
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
                    opacity: 0.2;
                }
            `}</style>
        </div>
    )
}


export default RoomPage;