import api from './axios';

export const getTasks = (filters = {}) =>{
  const clean = Object.fromEntries(Object.entries(filters).filter(([,value]) => value));
  const params = new URLSearchParams(clean).toString();
  return api.get(`tasks/?${params}`);
};

export const createTask = (taskData) => api.post('tasks/', taskData);

export const updateTask = (id, taskData) => api.patch(`tasks/${id}/`, taskData);

export const deleteTask = (id) => api.delete(`tasks/${id}/`);