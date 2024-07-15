import React, { useEffect, useState } from 'react';
import { fetchCards, addFavorite } from '../api';
import { useAuth } from '../AuthContext';

const Home: React.FC = () => {
  const [cards, setCards] = useState([]);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const getCards = async () => {
      try {
        const { data } = await fetchCards();
        setCards(data);
      } catch (err) {
        console.error(err);
      }
    };

    getCards();
  }, []);

  const handleFavorite = async (cardId: number) => {
    try {
      const response = await addFavorite(cardId);
      console.log('Favorite response:', response); // Debugging
      alert('Card favorited successfully!');
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data.message === 'Card already favorited') {
        alert('Card already favorited!');
      } else {
        alert('Failed to favorite card.');
      }
    }
  };

  return (
    <div className="container">
      <h1>All Cards</h1>
      <ul>
        {cards.map((card) => (
          <li key={card.id}>
            <h2>{card.title}</h2>
            <p>{card.description}</p>
            <p>{card.location}</p>
            <img src={card.image} alt={card.title} />
            {isAuthenticated && (
              <button onClick={() => handleFavorite(card.id)}>Favorite</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
