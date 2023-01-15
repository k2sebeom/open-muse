

interface Room {
    id: number,
    title: string,
    description: string,
    mode: 'OPEN' | 'SHOW',
    password?: string,
    members: number,
    streamKey: string,
    liveUrl: string,
    rtcToken?: string
}


export type {
    Room
}