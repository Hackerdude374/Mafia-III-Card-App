import React, { useEffect, useState } from 'react';
import { fetchFavorites, removeFavorite } from '../api';

const Profile: React.FC = () => {
  const [favorites, setFavorites] = useState([]);

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

    getFavorites();
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
      <h1>Favorite Cards</h1>
      <div className="cards-grid">
        {favorites.map((card) => (
          <div key={card.id} className="card">
            <h2>{card.title}</h2>
            <p>{card.description}</p>
            <p>{card.location}</p>
            <img src={card.image} alt={card.title} />
            <button onClick={() => handleUnfavorite(card.id)}>Unfavorite</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
