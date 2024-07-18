import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { updateCard, fetchCardById } from '../api';

const EditCard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const getCardDetails = async () => {
      try {
        const { data } = await fetchCardById(id);
        setTitle(data.title);
        setDescription(data.description);
        setLocation(data.location);
        setImage(data.image);
      } catch (err) {
        console.error('Error fetching card details:', err);
        alert('Failed to fetch card details.');
      }
    };

    getCardDetails();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedCard = {
        title,
        description,
        location,
        image,
      };
      await updateCard(id, updatedCard);
      alert('Card updated successfully!');
      navigate('/');
    } catch (err) {
      console.error('Error updating card:', err);
      alert('Failed to update card.');
    }
  };

  return (
    <div className="container">
      <h1>Edit Card</h1>
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
        <button type="submit">Update Card</button>
      </form>
    </div>
  );
};

export default EditCard;
