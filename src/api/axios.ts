import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  // baseURL: 'https://lazicvilla-local-api-765409507321.asia-southeast1.run.app/api',
  // baseURL: 'https://lazicvilla-sandbox-api-765409507321.asia-southeast1.run.app/api',
//   baseURL: 'https://lazicvilla-production-api-765409507321.asia-southeast1.run.app/api',
  
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export default api;