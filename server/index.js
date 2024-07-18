const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

const userRouter = require('./routes/user');
const cardRouter = require('./routes/card');
const favoritesRouter = require('./routes/favorites'); // Add this line
const allowedOrigins = [
  'http://localhost:3000', // For local development
  'https://mafia-iii-card-app.vercel.app' // Your deployed frontend on Vercel
];

app.use(cors({
  origin: allowedOrigins,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));




app.use(express.json());

app.use('/api/users', userRouter);
app.use('/api/cards', cardRouter);
app.use('/api/favorites', favoritesRouter); // Add this line

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
