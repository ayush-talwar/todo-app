import api from './axios';

export const getTasks = (filters = {}) =>{
  const params = new URLSearchParams(filters).toString();
  return api.get(`tasks/?${params}`);
};

export const createTask = (taskData) => api.post('tasks/', taskData);

export const updateTask = (id, taskData) => api.patch(`tasks/${id}/`, taskData);

export const deleteTask = (id) => api.delete(`tasks/${id}/`);