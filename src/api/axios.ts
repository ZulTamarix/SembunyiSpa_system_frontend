import axios from 'axios';

const api = axios.create({
  // baseURL: 'http://127.0.0.1:8000/api',
  baseURL: 'https://demo1.tamarix.com.my/sembunyiSpa_backend/public/api',

  headers: {
    // 'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export default api;