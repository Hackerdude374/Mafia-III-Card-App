import React, { useEffect, useState } from 'react';
import { fetchCards, fetchFavorites, addFavorite, removeFavorite } from '../api';
import { useAuth } from '../AuthContext';

const Home: React.FC = () => {
  const [cards, setCards] = useState([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const getCardsAndFavorites = async () => {
      try {
        const { data: cardsData } = await fetchCards();
        setCards(cardsData);

        if (isAuthenticated) {
          const { data: favoritesData } = await fetchFavorites();
          setFavorites(favoritesData.map((fav: any) => fav.id)); // Assuming 'id' is the card ID
        }
      } catch (err) {
        console.error(err);
      }
    };

    getCardsAndFavorites();
  }, [isAuthenticated]);

  const handleFavorite = async (cardId: number) => {
    try {
      await addFavorite(cardId);
      setFavorites([...favorites, cardId]);
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

  const handleUnfavorite = async (cardId: number) => {
    try {
      await removeFavorite(cardId);
      setFavorites(favorites.filter((id) => id !== cardId));
      alert('Card unfavorited successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to unfavorite card.');
    }
  };

  return (
    <div className="container">
      <h1>All Cards</h1>
      <div className="cards-grid">
        {cards.map((card) => (
          <div key={card.id} className="card">
            <h2>{card.title}</h2>
            <p>{card.description}</p>
            <p>{card.location}</p>
            <img src={card.image} alt={card.title} />
            {isAuthenticated && (
              favorites.includes(card.id) ? (
                <button onClick={() => handleUnfavorite(card.id)}>Unfavorite</button>
              ) : (
                <button onClick={() => handleFavorite(card.id)}>Favorite</button>
              )
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
