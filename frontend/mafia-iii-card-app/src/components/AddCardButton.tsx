import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const AddCardButton: React.FC = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/add-card');
  };

  return (
    <button className="fab" onClick={handleClick}>
      <FontAwesomeIcon icon={faPlus} />
    </button>
  );
};

export default AddCardButton;
