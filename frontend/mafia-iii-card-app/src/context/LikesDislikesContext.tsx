import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchCards } from '../api'; // Import the fetchCards API method

interface LikesDislikesContextType {
  likesDislikes: { [key: number]: 'like' | 'dislike' | null };
  setLikesDislikes: React.Dispatch<React.SetStateAction<{ [key: number]: 'like' | 'dislike' | null }>>;
}

const LikesDislikesContext = createContext<LikesDislikesContextType | undefined>(undefined);

export const LikesDislikesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [likesDislikes, setLikesDislikes] = useState<{ [key: number]: 'like' | 'dislike' | null }>({});

  useEffect(() => {
    const initializeLikesDislikes = async () => {
      try {
        const { data: cardsData } = await fetchCards();
        const initialLikesDislikes: { [key: number]: 'like' | 'dislike' | null } = {};
        cardsData.forEach((card: any) => {
          initialLikesDislikes[card.id] = null; // Initialize all as null or based on user preference
        });
        setLikesDislikes(initialLikesDislikes);
      } catch (err) {
        console.error('Error initializing likes and dislikes:', err);
      }
    };

    initializeLikesDislikes();
  }, []);

  return (
    <LikesDislikesContext.Provider value={{ likesDislikes, setLikesDislikes }}>
      {children}
    </LikesDislikesContext.Provider>
  );
};

export const useLikesDislikes = () => {
  const context = useContext(LikesDislikesContext);
  if (!context) {
    throw new Error('useLikesDislikes must be used within a LikesDislikesProvider');
  }
  return context;
};
