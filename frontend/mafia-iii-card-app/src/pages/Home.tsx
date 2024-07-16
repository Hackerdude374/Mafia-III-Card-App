import React, { useEffect, useState } from 'react';
import { fetchCards, fetchFavorites, addFavorite, removeFavorite, likeCard, dislikeCard } from '../api';
import { useAuth } from '../AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as solidHeart, faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import AddCardButton from '../components/AddCardButton'; // Ensure this import

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

  const handleLike = async (cardId: number) => {
    try {
      await likeCard(cardId);
      setCards(cards.map(card => card.id === cardId ? { ...card, likes: card.likes + 1 } : card));
    } catch (err) {
      console.error('Error liking card:', err);
    }
  };

  const handleDislike = async (cardId: number) => {
    try {
      await dislikeCard(cardId);
      setCards(cards.map(card => card.id === cardId ? { ...card, dislikes: card.dislikes + 1 } : card));
    } catch (err) {
      console.error('Error disliking card:', err);
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
            <div className="card-actions">
              <button onClick={() => handleLike(card.id)}>
                <FontAwesomeIcon icon={faThumbsUp} color={card.likes > 0 ? 'green' : 'gray'} /> {card.likes}
              </button>
              <button onClick={() => handleDislike(card.id)}>
                <FontAwesomeIcon icon={faThumbsDown} color={card.dislikes > 0 ? 'red' : 'gray'} /> {card.dislikes}
              </button>
              {isAuthenticated && (
                <>
                  {favorites.includes(card.id) ? (
                    <button onClick={() => handleUnfavorite(card.id)}>
                      <FontAwesomeIcon icon={solidHeart} color="red" />
                    </button>
                  ) : (
                    <button onClick={() => handleFavorite(card.id)}>
                      <FontAwesomeIcon icon={regularHeart} color="gray" />
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      {isAuthenticated && <AddCardButton />} {/* Conditionally render AddCardButton */}
    </div>
  );
};

export default Home;
