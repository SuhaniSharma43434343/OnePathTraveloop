import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

export const loginUser = (data) => API.post('/auth/login', data).then(r => r.data);

export const registerUser = ({ name, email, password, role, avatarFile }) => {
  const form = new FormData();
  form.append('name', name);
  form.append('email', email);
  form.append('password', password);
  form.append('role', role);
  if (avatarFile) form.append('avatar', avatarFile);
  return API.post('/auth/register', form).then(r => r.data);
};

export const fetchMe = (token) =>
  API.get('/user/me', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.data);

export const uploadAvatar = (token, file) => {
  const form = new FormData();
  form.append('avatar', file);
  return API.post('/user/avatar', form, {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
  }).then(r => r.data);
};
