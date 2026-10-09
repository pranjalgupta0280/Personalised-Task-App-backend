const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Error Handling Middleware Blueprint
app.use((err, req, res, next) => {
  // your code here
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? null : err.stack,
  });
});

const startServer = async () => {
  // your code here (connectDB, app.listen)
  connectDB();
  app.listen(process.env.PORT, () => {
    console.log(`Server running`);
  });
};

startServer();
