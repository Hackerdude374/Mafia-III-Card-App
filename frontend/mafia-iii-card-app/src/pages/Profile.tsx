import React, { useEffect, useState } from 'react';
import { fetchFavorites, fetchUserCards, removeFavorite, deleteCard } from '../api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as solidHeart, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const [favorites, setFavorites] = useState([]);
  const [userCards, setUserCards] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getFavorites = async () => {
      try {
        const { data } = await fetchFavorites();
        setFavorites(data);
      } catch (err) {
        console.error('Error fetching favorites:', err);
      }
    };

    const getUserCards = async () => {
      try {
        const { data } = await fetchUserCards();
        setUserCards(data);
      } catch (err) {
        console.error('Error fetching user cards:', err);
      }
    };

    getFavorites();
    getUserCards();
  }, []);

  const handleUnfavorite = async (cardId: number) => {
    try {
      await removeFavorite(cardId);
      setFavorites(favorites.filter((card) => card.id !== cardId));
      alert('Card unfavorited successfully!');
    } catch (err) {
      console.error('Error unfavoriting card:', err);
      alert('Failed to unfavorite card.');
    }
  };

  const handleEdit = (cardId: number) => {
    navigate(`/edit-card/${cardId}`);
  };

  const handleDelete = async (cardId: number) => {
    try {
      await deleteCard(cardId);
      setUserCards(userCards.filter(card => card.id !== cardId));
      alert('Card deleted successfully!');
    } catch (err) {
      console.error('Error deleting card:', err);
      alert('Failed to delete card.');
    }
  };

  return (
    <div className="container">
      <h1>Profile</h1>

      <h2>Your Favorite Cards</h2>
      <div className="cards-grid">
        {favorites.map((card) => (
          <div key={card.id} className="card">
            <h2>{card.title}</h2>
            <p>{card.description}</p>
            <p>{card.location}</p>
            <img src={card.image} alt={card.title} />
            <button onClick={() => handleUnfavorite(card.id)}>
              <FontAwesomeIcon icon={solidHeart} color="red" />
            </button>
          </div>
        ))}
      </div>

      <h2>Your Created Cards</h2>
      <div className="cards-grid">
        {userCards.map((card) => (
          <div key={card.id} className="card">
            <h2>{card.title}</h2>
            <p>{card.description}</p>
            <p>{card.location}</p>
            <img src={card.image} alt={card.title} />
            <div className="card-actions">
              <button onClick={() => handleEdit(card.id)}>
                <FontAwesomeIcon icon={faEdit} color="blue" />
              </button>
              <button onClick={() => handleDelete(card.id)}>
                <FontAwesomeIcon icon={faTrash} color="red" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
