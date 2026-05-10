import axios from 'axios';

const api = axios.create({ baseURL: '/api/trips' });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getTrips = async () => {
  const { data } = await api.get('/');
  return data;
};

export const createTrip = async (tripData) => {
  const { data } = await api.post('/', tripData);
  return data;
};
