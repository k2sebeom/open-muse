import axios from 'axios';

export const BASE_URL = 'https://dev.museli.o-r.kr'; //'http://127.0.0.1:8000';

export async function getRoomList() {
  try {
    const resp = await axios.get(BASE_URL + '/api/room/list');
    return resp.data;
  } catch {
    return { data: [] };
  }
}

export async function getRoom(id: string) {
  try {
    const resp = await axios.get(BASE_URL + `/api/room/${id}`);
    return resp.data;
  } catch {
    return { data: null };
  }
}

export async function createRoom(
  title: string,
  description: string,
  mode: 'OPEN' | 'SHOW',
  password: string
) {
  try {
    const body = {
      title,
      description,
      mode,
      password: password.length === 0 ? null : password,
    };
    const resp = await axios.post(BASE_URL + '/api/room/', body, {
      headers: {
        'content-type': 'application/json',
      },
    });
    return resp.data;
  } catch {
    return { data: null };
  }
}

export async function joinRoom(
  roomId: string,
  username: string,
  password: string
) {
  try {
    const resp = await axios.post(
      BASE_URL + `/api/room/${roomId}/join`,
      {
        password,
        username,
      },
      {
        headers: {
          'content-type': 'application/json',
        },
      }
    );
    return resp.data;
  } catch {
    return { data: null };
  }
}
