const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

const userRouter = require('./routes/user');

app.use(cors());
app.use(express.json());

app.use('/api/users', userRouter);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
