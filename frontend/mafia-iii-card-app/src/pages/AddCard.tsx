import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCard } from '../api';

const AddCard: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCard({ title, description, location, image });
      alert('Card created successfully!');
      navigate('/'); // Redirect to home or wherever appropriate
    } catch (err) {
      console.error(err);
      alert('Failed to create card.');
    }
  };

  return (
    <div className="container">
      <h1>Add a New Card</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          required
        />
        <button type="submit">Add Card</button>
      </form>
    </div>
  );
};

export default AddCard;
