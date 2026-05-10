import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    const message = err.response?.data?.message || err.message || 'Request failed';
    return Promise.reject(new Error(message));
  }
);

export const getTrips = async () => {
  const { data } = await api.get('/trips');
  return data;
};

export const createTrip = async (tripData) => {
  const { data } = await api.post('/trips', tripData);
  return data;
};
