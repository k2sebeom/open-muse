import axios from "axios";

const BASE_URL = 'http://127.0.0.1:8000';

export async function getRoomList() {
  const resp = await axios.get(BASE_URL + '/api/room/list');
  return resp.data;
}
