import axios from 'axios';

const api = axios.create({
 baseURL: 'http://localhost:5000/api',
 // baseURL: 'https://mafia-iii-card-app.onrender.com/api'
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchCards = () => api.get('/cards');
export const fetchFavorites = () => api.get('/favorites');
export const fetchUserCards = () => api.get('/cards/user');
export const addFavorite = (cardId) => api.post(`/favorites/${cardId}`);
export const removeFavorite = (cardId) => api.delete(`/favorites/${cardId}`);
export const createCard = (cardData) => api.post('/cards', cardData);
export const likeCard = (cardId) => api.post(`/cards/${cardId}/like`);
export const dislikeCard = (cardId) => api.post(`/cards/${cardId}/dislike`);
export const unlikeCard = (cardId) => api.delete(`/cards/${cardId}/unlike`);
export const undislikeCard = (cardId) => api.delete(`/cards/${cardId}/undislike`);
export const loginUser = (credentials) => api.post('/users/login', credentials);
export const registerUser = (userData) => api.post('/users/signup', userData);
//export const updateCard = (cardId, cardData) => api.put(`/cards/${cardId}`, cardData);
export const deleteCard = (cardId) => api.delete(`/cards/${cardId}`);
export const fetchCard = (cardId) => api.get(`/cards/${cardId}`);
export const updateCard = (cardId, cardData) => api.put(`/cards/${cardId}`, cardData);
export const fetchCardById = (id) => api.get(`/cards/${id}`);