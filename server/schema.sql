-- Create users table
-- This table stores user information including their unique ID, username, password, and admin status.
-- The UNIQUE constraint on the username ensures no two users can have the same username.
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE
);

-- Create cards table
-- This table stores information about the cards including their title, description, location, image, like count, dislike count, and the user who created the card.
-- The FOREIGN KEY constraint on user_id ensures that each card is associated with a valid user.
CREATE TABLE cards (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  location VARCHAR(255),
  image TEXT,
  likes INTEGER DEFAULT 0,
  dislikes INTEGER DEFAULT 0,
  user_id INTEGER REFERENCES users(id),
  liked_by INTEGER[], -- Array of user IDs who liked this card
  disliked_by INTEGER[] -- Array of user IDs who disliked this card
);

-- Create favorites table
-- This table creates a many-to-many relationship between users and cards to store which users have favorited which cards.
-- The PRIMARY KEY constraint ensures that each user can only favorite a particular card once.
CREATE TABLE favorites (
  user_id INTEGER REFERENCES users(id),
  card_id INTEGER REFERENCES cards(id),
  PRIMARY KEY (user_id, card_id)
);

-- Create likes_dislikes table
-- This table tracks the like and dislike actions by users on cards.
-- The PRIMARY KEY constraint ensures that each user can only have one like or dislike action per card.
-- The type column stores whether the action is a 'like' or 'dislike'.
CREATE TABLE likes_dislikes (
  user_id INTEGER REFERENCES users(id),
  card_id INTEGER REFERENCES cards(id),
  type VARCHAR(10) NOT NULL, -- 'like' or 'dislike'
  PRIMARY KEY (user_id, card_id)
);
