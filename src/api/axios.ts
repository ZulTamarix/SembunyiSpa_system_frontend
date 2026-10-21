import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  // baseURL: 'https://demo1.tamarix.com.my/sembunyiSpa_backend/public/api',

  headers: {
    'Accept': 'application/json',
  },
});
export default api;


api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});


export const api_image = 'http://localhost:8000'
// export const api_image = 'https://demo1.tamarix.com.my/sembunyiSpa_backend/public'


