
// const express = require('express');
// const cors = require('cors');
// const { Sequelize } = require('sequelize'); // Add Sequelize for database connection

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Import routers
// const userRouter = require('./routes/user');
// const cardRouter = require('./routes/card');
// const favoritesRouter = require('./routes/favorites'); // Add this line
// //frontend URLS
// const allowedOrigins = [
//   'http://localhost:5173', // For local development
//   'https://mafia-iii-card-app.vercel.app', // Your primary Vercel URL
//   'https://mafia-iii-card-dlvb9nt78-hackerdude374s-projects.vercel.app', // Another Vercel URL
//   'https://mafia-iii-card-7st6mq1sf-hackerdude374s-projects.vercel.app' // New Vercel URL causing the issue
// ];


// app.use(cors({
//   origin: allowedOrigins,
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//   credentials: true,
// }));

// app.use(express.json());

// app.use('/api/users', userRouter);
// app.use('/api/cards', cardRouter);
// app.use('/api/favorites', favoritesRouter); // Add this line

// // Initialize Sequelize with SSL
// const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
//   host: process.env.DB_HOST,
//   dialect: 'postgres',
//   port: process.env.DB_PORT,
//   dialectOptions: {
//     ssl: {
//       require: true,
//       rejectUnauthorized: false // You can change this to true if you have the CA certificates
//     }
//   },
//   logging: console.log // Enable Sequelize logging to see SQL queries
// });

// // Debug function to check database connection
// async function checkDatabaseConnection() {
//   try {
//     await sequelize.authenticate();
//     console.log('Connection has been established successfully.');
//   } catch (error) {
//     console.error('Unable to connect to the database:', error);
//   }
// }

// // Run the debug function
// checkDatabaseConnection();

// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
//   // Debug statements
// console.log('Allowed origins:', allowedOrigins);
// });
 

const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const PORT = process.env.PORT || 5000;

// Import routers
const userRouter = require('./routes/user');
const cardRouter = require('./routes/card');
const favoritesRouter = require('./routes/favorites');

// Initialize Prisma
const prisma = new PrismaClient();

// Frontend URLs
const allowedOrigins = [
  'http://localhost:5173',
  'https://mafia-iii-card-app.vercel.app',
  'https://mafia-iii-card-dlvb9nt78-hackerdude374s-projects.vercel.app',
  'https://mafia-iii-card-7st6mq1sf-hackerdude374s-projects.vercel.app'
];

app.use(cors({
  origin: allowedOrigins,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

app.use(express.json());

app.use('/api/users', userRouter);
app.use('/api/cards', cardRouter);
app.use('/api/favorites', favoritesRouter);

// Debug function to check database connection
async function checkDatabaseConnection() {
  try {
    await prisma.$connect();
    console.log('Connection to the database has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

// Run the debug function
checkDatabaseConnection();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log('Allowed origins:', allowedOrigins);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('SIGINT signal received: closing HTTP server')
  server.close(() => {
    console.log('HTTP server closed')
  });
  await prisma.$disconnect();
  process.exit(0);
});
