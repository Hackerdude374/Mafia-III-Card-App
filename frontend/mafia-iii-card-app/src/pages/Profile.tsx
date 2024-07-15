import React, { useEffect, useState } from 'react';
import { fetchFavorites } from '../api';

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

  return (
    <div className="container">
      <h1>Favorite Cards</h1>
      <ul>
        {favorites.map((card) => (
          <li key={card.id}>
            <h2>{card.title}</h2>
            <p>{card.description}</p>
            <p>{card.location}</p>
            <img src={card.image} alt={card.title} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Profile;
