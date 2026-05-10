import axios from 'axios';

const api = axios.create({ baseURL: '/api/utilities' });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Checklist
export const getChecklist = async (tripId) => (await api.get(`/${tripId}/checklist`)).data;
export const addChecklistItem = async (tripId, data) => (await api.post(`/${tripId}/checklist`, data)).data;
export const updateChecklistItem = async (id, data) => (await api.put(`/checklist/${id}`, data)).data;
export const deleteChecklistItem = async (id) => (await api.delete(`/checklist/${id}`)).data;

// Notes
export const getNotes = async (tripId) => (await api.get(`/${tripId}/notes`)).data;
export const addNote = async (tripId, data) => (await api.post(`/${tripId}/notes`, data)).data;
export const deleteNote = async (id) => (await api.delete(`/notes/${id}`)).data;
