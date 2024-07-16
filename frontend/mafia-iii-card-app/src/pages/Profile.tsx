import React, { useEffect, useState } from 'react';
import { fetchFavorites, removeFavorite, fetchUserCards } from '../api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';

const Profile: React.FC = () => {
  const [favorites, setFavorites] = useState([]);
  const [userCards, setUserCards] = useState([]);

  useEffect(() => {
    const getFavorites = async () => {
      try {
        const { data } = await fetchFavorites();
        console.log('Fetched favorites:', data); // Debugging
        setFavorites(data);
      } catch (err) {
        console.error(err);
      }
    };

    const getUserCards = async () => {
      try {
        const { data } = await fetchUserCards();
        console.log('Fetched user cards:', data); // Debugging
        setUserCards(data);
      } catch (err) {
        console.error(err);
      }
    };

    getFavorites();
    getUserCards();
  }, []);

  const handleUnfavorite = async (cardId: number) => {
    try {
      const response = await removeFavorite(cardId);
      console.log('Unfavorite response:', response); // Debugging
      setFavorites(favorites.filter((card) => card.id !== cardId));
      alert('Card unfavorited successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to unfavorite card.');
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
            {/* Add any additional actions for the user's created cards if needed */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
