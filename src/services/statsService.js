import api from '../config/api.js';

export async function getPublicStats() {
  const { data } = await api.get('/stats');
  return data;
}
