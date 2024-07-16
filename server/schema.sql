-- Create users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE
);

-- Create cards table
CREATE TABLE cards (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  location VARCHAR(255),
  image TEXT,
  likes INTEGER DEFAULT 0,
  dislikes INTEGER DEFAULT 0,
  user_id INTEGER REFERENCES users(id)
);

-- Create favorites table
CREATE TABLE favorites (
  user_id INTEGER REFERENCES users(id),
  card_id INTEGER REFERENCES cards(id),
  PRIMARY KEY (user_id, card_id)
);

-- Create likes_dislikes table
CREATE TABLE likes_dislikes (
  user_id INTEGER REFERENCES users(id),
  card_id INTEGER REFERENCES cards(id),
  type VARCHAR(10) NOT NULL, -- 'like' or 'dislike'
  PRIMARY KEY (user_id, card_id)
);
