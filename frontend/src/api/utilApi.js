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

export const getChecklist        = async (tripId) => (await api.get(`/utilities/${tripId}/checklist`)).data;
export const addChecklistItem    = async (tripId, data) => (await api.post(`/utilities/${tripId}/checklist`, data)).data;
export const updateChecklistItem = async (id, data)    => (await api.put(`/utilities/checklist/${id}`, data)).data;
export const deleteChecklistItem = async (id)          => (await api.delete(`/utilities/checklist/${id}`)).data;

export const getNotes   = async (tripId)       => (await api.get(`/utilities/${tripId}/notes`)).data;
export const addNote    = async (tripId, data) => (await api.post(`/utilities/${tripId}/notes`, data)).data;
export const deleteNote = async (id)           => (await api.delete(`/utilities/notes/${id}`)).data;
