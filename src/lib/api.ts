import axios from "axios";

const BASE_URL = 'http://127.0.0.1:8000';

export async function getRoomList() {
  try {
    const resp = await axios.get(BASE_URL + '/api/room/list');
    return resp.data;
  }
  catch {
    return { data: [] };
  }
}


export async function createRoom(title: string, description: string, mode: 'OPEN' | 'SHOW', password: string) {
  try {
    let body = { title, description, mode, password: password.length === 0 ? null : password };
    const resp = await axios.post(BASE_URL + '/api/room/', body,
    {
      headers: {
        'content-type': 'application/json'
      }
    });
    return resp.data;
  }
  catch {
    return { data: null };
  }
}