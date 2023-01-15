import AgoraRTC, { IAgoraRTCClient, IMicrophoneAudioTrack, IRemoteAudioTrack, UID } from "agora-rtc-sdk-ng";

const APP_ID='d929e0a1b619489082cc9ca3b4c3622e';

type RemoteTrack = {
    uid: UID,
    track: IRemoteAudioTrack
}

class RtcClient {
    private engine: IAgoraRTCClient;

    private localAudioTrack: IMicrophoneAudioTrack | null = null;
    private remoteAudioTracks: RemoteTrack[] = [];

    constructor() {
        this.engine = AgoraRTC.createClient({
            mode: 'rtc',
            codec: 'vp8'
        });
        this.setUp();
    }

    private setUp() {
        this.engine.on("user-published", async (user, mediaType) => {
            console.log(user)
            await this.engine.subscribe(user, mediaType);

            if(mediaType == 'audio' && user.audioTrack) {
                this.remoteAudioTracks.push({
                    uid: user.uid,
                    track: user.audioTrack
                });
                user.audioTrack.play();
            }
        })

        this.engine.on("user-unpublished", (user) => {
            const track =  this.remoteAudioTracks.find((t => {
                return t.uid == user.uid;
            }));
            if(track) {
                track.track.stop();
            }
            this.remoteAudioTracks = this.remoteAudioTracks.filter(t => {
                return t.uid !== user.uid;
            })
        })
    }

    public async join(roomId: string, token: string, username: string) {
        if(this.engine.connectionState !== "DISCONNECTED") {
            console.log("Already joined");
            return;
            
        }
        await this.engine.join(APP_ID, `channel-${roomId}`, token, username);
        this.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
        await this.engine.publish(this.localAudioTrack);
    }

    public setMuted(muted: boolean) {
        this.localAudioTrack?.setMuted(muted);
    }
}


export default RtcClient;