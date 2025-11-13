const Recipe = require('../models/Recipe');

// Get all recipes
exports.getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({}).select('-__v');
    res.json({
      success: true,
      count: recipes.length,
      recipes: recipes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching recipes',
      error: error.message
    });
  }
};

// Get recipe by ID
exports.getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findOne({ id: req.params.id }).select('-__v');
    
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    res.json({
      success: true,
      recipe: recipe
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching recipe',
      error: error.message
    });
  }
};

// Get recipes by category
exports.getRecipesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const recipes = await Recipe.find({ category: category }).select('-__v');
    
    res.json({
      success: true,
      category: category,
      count: recipes.length,
      recipes: recipes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching recipes by category',
      error: error.message
    });
  }
};

// Search recipes
exports.searchRecipes = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const recipes = await Recipe.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ]
    }).select('-__v');
    
    res.json({
      success: true,
      query: q,
      count: recipes.length,
      recipes: recipes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching recipes',
      error: error.message
    });
  }
};

// Create new recipe
exports.createRecipe = async (req, res) => {
  try {
    const recipe = new Recipe(req.body);
    await recipe.save();
    
    res.status(201).json({
      success: true,
      message: 'Recipe created successfully',
      recipe: recipe
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating recipe',
      error: error.message
    });
  }
};

// Update recipe
exports.updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    res.json({
      success: true,
      message: 'Recipe updated successfully',
      recipe: recipe
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating recipe',
      error: error.message
    });
  }
};

// Delete recipe
exports.deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findOneAndDelete({ id: req.params.id });
    
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    res.json({
      success: true,
      message: 'Recipe deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting recipe',
      error: error.message
    });
  }
};

// Get all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Recipe.distinct('category');
    
    res.json({
      success: true,
      count: categories.length,
      categories: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message
    });
  }
};
