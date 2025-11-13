const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');

// GET routes
router.get('/', recipeController.getAllRecipes);
router.get('/search', recipeController.searchRecipes);
router.get('/categories', recipeController.getCategories);
router.get('/category/:category', recipeController.getRecipesByCategory);
router.get('/:id', recipeController.getRecipeById);

// POST routes
router.post('/', recipeController.createRecipe);

// PUT routes
router.put('/:id', recipeController.updateRecipe);

// DELETE routes
router.delete('/:id', recipeController.deleteRecipe);

module.exports = router;
