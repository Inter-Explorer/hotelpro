import axios from 'axios';

// One axios instance for all calls to the backend.
const client = axios.create({ baseURL: '/api' });

// Before every request, add the login token (if there is one).
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// api('/rooms')  or  api('/rooms', { method: 'POST', body: {...} })
// Returns the data, or throws an Error with the server's message.
export async function api(path, { method = 'GET', body } = {}) {
  try {
    const res = await client({ url: path, method, data: body });
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Something went wrong');
  }
}
