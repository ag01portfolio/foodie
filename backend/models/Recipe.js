const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
  ingredient: {
    type: String,
    required: true
  },
  measure: {
    type: String,
    required: true
  }
}, { _id: false });

const recipeSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  thumbnail: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['North Karnataka', 'South Indian', 'North Indian', 'Punjabi', 'Other']
  },
  area: {
    type: String,
    default: 'India'
  },
  tags: [{
    type: String
  }],
  instructions: {
    type: String,
    required: true
  },
  ingredients: [ingredientSchema],
  youtubeUrl: {
    type: String
  },
  source: {
    type: String
  }
}, {
  timestamps: true
});

// Indexes for better query performance
recipeSchema.index({ name: 'text', category: 'text', tags: 'text' });
recipeSchema.index({ category: 1 });
recipeSchema.index({ id: 1 });

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
