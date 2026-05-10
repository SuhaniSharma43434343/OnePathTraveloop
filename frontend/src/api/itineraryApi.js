import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  err => Promise.reject(new Error(err.response?.data?.message || err.message))
);

export const getStops       = async (tripId) => (await api.get(`/stops/trip/${tripId}`)).data;
export const createStop     = async (data)   => (await api.post('/stops', data)).data;
export const getActivities  = async (stopId) => (await api.get(`/activities/stop/${stopId}`)).data;
export const createActivity = async (data)   => (await api.post('/activities', data)).data;
