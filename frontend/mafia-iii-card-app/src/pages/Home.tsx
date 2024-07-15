import React, { useEffect, useState } from 'react';
import { fetchCards } from '../api';

const Home: React.FC = () => {
  const [cards, setCards] = useState([]);

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
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
