const mongoose = require('mongoose');
const Recipe = require('../models/Recipe');
require('dotenv').config();

// Import Indian recipes data
const { indianRecipes } = require('./indianRecipesData');

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Abhi Mongooooooooooo::  MongoDB Connected');

    // Clear existing recipes
    await Recipe.deleteMany({});
    console.log('Abhi Mongooooooooooo::  Cleared existing recipes');

    // Insert Indian recipes
    await Recipe.insertMany(indianRecipes);
    console.log(`Abhi Mongooooooooooo:: Inserted ${indianRecipes.length} recipes successfully!`);

    console.log('\nAbhi Mongooooooooooo:: Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Abhi Mongooooooooooo:: Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
