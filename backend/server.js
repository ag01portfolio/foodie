const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const recipeRoutes = require('./routes/recipeRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// MongoDB da connection 
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Abhi --- MongoDB Connected Boss'))
.catch((err) => console.log(' ---- x x Abhi ---- MongoDB dint   wrk    Error:', err));

// Routes
app.get('/', (req, res) => {
  res.json({
    message: '🍽️ Recipe App Backend API',
    version: '1.0.0',
    endpoints: {
      recipes: '/api/recipes',
      recipeById: '/api/recipes/:id',
      recipesByCategory: '/api/recipes/category/:category',
      searchRecipes: '/api/recipes/search?q=query',
    }
  });
});

app.use('/api/recipes', recipeRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running Boss : http://localhost:${PORT}`);
  console.log(`Challlooo..`);
});
