import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const fetchCards = () => API.get('/cards');
export const createCard = (cardData) => API.post('/cards', cardData);
export const updateCard = (id, cardData) => API.put(`/cards/${id}`, cardData);
export const deleteCard = (id) => API.delete(`/cards/${id}`);
export const loginUser = (userData) => API.post('/users/login', userData);
export const registerUser = (userData) => API.post('/users/signup', userData);
export const fetchFavorites = () => API.get('/favorites');
export const addFavorite = (cardId) => API.post(`/favorites/${cardId}`);
export const removeFavorite = (cardId) => API.delete(`/favorites/${cardId}`);
