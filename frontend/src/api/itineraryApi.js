import axios from 'axios';

const apiStops = axios.create({ baseURL: '/api/stops' });
const apiActivities = axios.create({ baseURL: '/api/activities' });

[apiStops, apiActivities].forEach(api => {
  api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
});

export const getStops = async (tripId) => {
  const { data } = await apiStops.get(`/trip/${tripId}`);
  return data;
};

export const createStop = async (stopData) => {
  const { data } = await apiStops.post('/', stopData);
  return data;
};

export const getActivities = async (stopId) => {
  const { data } = await apiActivities.get(`/stop/${stopId}`);
  return data;
};

export const createActivity = async (activityData) => {
  const { data } = await apiActivities.post('/', activityData);
  return data;
};
