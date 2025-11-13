# Foodie - Indian Recipe App 🚀

A high-performance [60fps scrolling even with 1000+ items] React Native recipe application optimized for 
**low-end devices**, using the **highly optimized FlashList** component 
to ensure buttery-smooth scrolling and efficient memory usage.

------------------------------------------------------------------------------


## ⚡ Performance Optimizations

This app is built specifically for low-end devices with these optimizations:

1. **FlashList**: Uses recycled views for 10x faster list rendering
2. **Memoization**: React.memo and useMemo prevent unnecessary re-renders
3. **Image Optimization**: Expo Image with aggressive caching
4. **Debounced Search**: Reduces API calls during typing
5. **Lazy Loading**: Components load on-demand
6. **Minimal Re-renders**: Optimized state management
7. **Native Navigation**: Smooth transitions without JS thread blocking
8. **Remove Clipped Subviews**: Only renders visible content

-----------------------------------------------------------------------------------
## 🎯 Features

- **⚡ Ultra-Fast Performance**: Optimized for low-end devices with FlashList
- **🔍 Smart Search**: Real-time recipe search with debouncing
- **🎨 Sort & Filter**: Sort by name (A-Z, Z-A) or category, filter by recipe categories
- **📱 Two Clean Screens**:
  - **Recipe List Screen**: Browse all recipes with smooth scrolling
  - **Recipe Detail Screen**: View large recipe images and detailed instructions
- **🔄 Easy API Switching**: Simple configuration to switch between different recipe APIs
- **📦 Image Optimization**: Expo Image with memory-disk caching for fast loading
- **🎭 Smooth Navigation**: Native stack navigation with fluid animations

---------------------------------------------------------------------------------------------
### API Endpoints

The backend provides 8 REST endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/recipes` | Get all recipes |
| GET | `/api/recipes/search?q=query` | Search recipes |
| GET | `/api/recipes/:id` | Get recipe details |
| GET | `/api/recipes/category/:category` | Get by category |
| GET | `/api/recipes/categories` | Get all categories |
| POST | `/api/recipes` | Create recipe |
| PUT | `/api/recipes/:id` | Update recipe |
| DELETE | `/api/recipes/:id` | Delete recipe |


------------------------------------------------------------------------------------------
## 🎨 Features Breakdown

### Screen 1: Recipe List
- **FlashList Implementation**: 60fps scrolling even with 1000+ items
- **Search Bar**: Find recipes by name
- **Category Filters**: Filter by Breakfast, Lunch, Dinner, Dessert, etc.
- **Sort Options**: 
  - A-Z (ascending)
  - Z-A (descending)
  - By Category
- **Optimized Rendering**: Only renders visible items

### Screen 2: Recipe Detail
- **Large Hero Image**: Full-width recipe photo
- **Ingredients List**: Organized list with measurements
- **Step-by-Step Instructions**: Clear cooking instructions
- **Tags & Metadata**: Recipe tags, category, and cuisine type
- **Image Caching**: Fast loading with memory-disk cache

--------------------------------------------------------------------------------------------------

## 📦 Dependencies

- **React Native**: 0.73.2
- **Expo**: ~50.0.0
- **@shopify/flash-list**: ^1.6.3 (High-performance list)
- **@react-navigation/native**: ^6.1.9 (Navigation)
- **expo-image**: ~1.10.1 (Optimized images)