import axios from 'axios';

const SERVER_URL =
  process.env.REACT_NATIVE_SERVER_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: SERVER_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
