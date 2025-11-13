import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Pressable,
  Alert,
  Image,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import apiService from '../services/apiService';
import { Recipe, SortOption } from '../types/recipe';
import AbhiColours from '../abhi-colours';
import SkeletonLoader from '../components/SkeletonLoader';

type RootStackParamList = {
  Login: undefined;
  RecipeList: undefined;
  RecipeDetail: { recipeId: string };
};

type RecipeListScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'RecipeList'>;
};

const RecipeListScreen: React.FC<RecipeListScreenProps> = ({ navigation }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('name-asc');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  // Rotating placeholder messages
  const placeholderMessages = [
    'Hi Chef 👨‍🍳',
    'Crafted with care, cooked with love...',
    'Search for your fav. recipes 🔍',
    'Foodie app by Abhishek 🍲',
  ];

  // Fetch recipes on mount
  useFocusEffect(
    useCallback(() => {
      loadRecipes();
    }, [])
  );

  // Toggle placeholder text every 3 seconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prevIndex) => (prevIndex + 1) % placeholderMessages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const loadRecipes = async () => {
    try {
      setLoading(true);
      const data = await apiService.searchRecipes('');
      setRecipes(data);
      setFilteredRecipes(data);
      console.log('Abhii Loaded Recipes :) ', data);
      console.log('First recipe thumbnail:', data[0]?.thumbnail);
    } catch (error) {
      console.error('Abhii --- x xx- -x  recipes log aglilla  E =>', error);
    } finally {
      setLoading(false);
    }
  };

  // Search handler with debouncing effect
  const handleSearch = useCallback(
    async (query: string) => {
      setSearchQuery(query);
      
      if (query.trim() === '') {
        setFilteredRecipes(recipes);
        return;
      }

      const filtered = recipes.filter((recipe) =>
        recipe.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredRecipes(filtered);
    },
    [recipes]
  );

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set<string>();
    recipes.forEach((recipe) => {
      if (recipe.category) cats.add(recipe.category);
    });
    return ['All', ...Array.from(cats)];
  }, [recipes]);

  // Filter by category
  const handleCategoryFilter = useCallback(
    (category: string) => {
      setSelectedCategory(category);
      
      if (category === 'All') {
        setFilteredRecipes(recipes);
      } else {
        const filtered = recipes.filter((recipe) => recipe.category === category);
        setFilteredRecipes(filtered);
      }
      setSearchQuery('');
    },
    [recipes]
  );

  // Sort recipes and create infinite loop by repeating data
  const sortedRecipes = useMemo(() => {
    const sorted = [...filteredRecipes];
    
    switch (sortOption) {
      case 'name-asc':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'category':
        sorted.sort((a, b) => 
          (a.category || '').localeCompare(b.category || '')
        );
        break;
    }
    
    // Loop/recycle the data to make the list longer (repeat 10 times)
    const recycledData: Recipe[] = [];
    for (let i = 0; i < 10; i++) {
      sorted.forEach((recipe, index) => {
        recycledData.push({
          ...recipe,
          id: `${recipe.id}_copy_${i}_${index}`, // Unique ID for each copy
        });
      });
    }
    
    return recycledData;
  }, [filteredRecipes, sortOption]);

  // Render recipe item - memoized for performance
  const renderRecipeItem = useCallback(
    ({ item }: { item: Recipe }) => {
      // Extract original ID (remove _copy_X_Y suffix if present)
      const originalId = item.id.split('_copy_')[0];
      
      return (
        <Pressable
          style={({ pressed }) => [
            styles.recipeCard,
            pressed && styles.recipeCardPressed,
          ]}
          onPress={() => navigation.navigate('RecipeDetail', { recipeId: originalId })}
        >
          <Image
            source={{ uri: item.thumbnail }}
            style={styles.thumbnail}
            resizeMode="cover"
            defaultSource={require('../assets/google-logo.png')}
            onError={(error) => console.log('Image load error:', error.nativeEvent.error)}
            onLoad={() => console.log('Image loaded:', item.name)}
          />
          <View style={styles.recipeInfo}>
            <Text style={styles.recipeName} numberOfLines={2}>
              {item.name}
            </Text>
            {item.category && (
              <Text style={styles.recipeCategory}>{item.category}</Text>
            )}
            {item.area && (
              <Text style={styles.recipeArea}>{item.area}</Text>
            )}
          </View>
        </Pressable>
      );
    },
    [navigation]
  );

  // Key extractor for FlashList
  const keyExtractor = useCallback((item: Recipe) => item.id, []);

  // Logout handler
  const handleLogout = useCallback(() => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => navigation.navigate('Login'),
        },
      ],
      { cancelable: true }
    );
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
        <Text style={styles.loadingText}>Loading recipes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder={placeholderMessages[placeholderIndex]}
          value={searchQuery}
          onChangeText={handleSearch}
          placeholderTextColor="#999"
        />
      </View>

      {/* Category Filter */}
      <View style={styles.filterContainer}>
        <FlashList
          data={categories}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryButton,
                selectedCategory === item && styles.categoryButtonActive,
              ]}
              onPress={() => handleCategoryFilter(item)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === item && styles.categoryTextActive,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
          horizontal
          estimatedItemSize={80}
          showsHorizontalScrollIndicator={false}

        />
      </View>

      {/* Sort Options */}
      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Sort by:</Text>
        <TouchableOpacity
          style={[styles.sortButton, sortOption === 'name-asc' && styles.sortButtonActive]}
          onPress={() => setSortOption('name-asc')}
        >
          <Text style={styles.sortText}>A-Z</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sortButton, sortOption === 'name-desc' && styles.sortButtonActive]}
          onPress={() => setSortOption('name-desc')}
        >
          <Text style={styles.sortText}>Z-A</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sortButton, sortOption === 'category' && styles.sortButtonActive]}
          onPress={() => setSortOption('category')}
        >
          <Text style={styles.sortText}>Category</Text>
        </TouchableOpacity>
      </View>

      {/* Recipe List  */}
      { /* Abhi Todo tanstack try maadbeku */}
      <FlashList
        data={sortedRecipes}
        renderItem={renderRecipeItem}
        keyExtractor={keyExtractor}
        estimatedItemSize={120}
        decelerationRate={0.99}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No recipes found</Text>
          </View>
        }
        ListFooterComponent={<SkeletonLoader count={3} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AbhiColours.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AbhiColours.background,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: AbhiColours.textSecondary,
  },
  searchContainer: {
    padding: 16,
    backgroundColor: AbhiColours.white,
    borderBottomWidth: 1,
    borderBottomColor: AbhiColours.border,
  },
  searchInput: {
    height: 45,
    backgroundColor: AbhiColours.inputBackground,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: AbhiColours.textPrimary,
  },
  filterContainer: {
    height: 50,
    backgroundColor: AbhiColours.white,
    borderBottomWidth: 1,
    borderBottomColor: AbhiColours.border,
    paddingHorizontal: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 6,
    backgroundColor: AbhiColours.categoryDefault,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryButtonActive: {
    backgroundColor: AbhiColours.categoryActive,
  },
  categoryText: {
    fontSize: 14,
    color: AbhiColours.categoryText,
    fontWeight: '500',
  },
  categoryTextActive: {
    color: AbhiColours.categoryTextActive,
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: AbhiColours.white,
    borderBottomWidth: 1,
    borderBottomColor: AbhiColours.border,
  },
  sortLabel: {
    fontSize: 14,
    color: AbhiColours.textSecondary,
    marginRight: 12,
    fontWeight: '600',
  },
  sortButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: AbhiColours.buttonSecondary,
    borderRadius: 16,
    marginRight: 8,
  },
  sortButtonActive: {
    backgroundColor: AbhiColours.buttonActive,
  },
  sortText: {
    fontSize: 13,
    color: AbhiColours.textPrimary,
    fontWeight: '500',
  },
  recipeCard: {
    flexDirection: 'row',
    backgroundColor: AbhiColours.cardBackground,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: AbhiColours.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  recipeCardPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  thumbnail: {
    width: 100,
    height: 100,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
  },
  recipeInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  recipeName: {
    fontSize: 16,
    fontWeight: '600',
    color: AbhiColours.textPrimary,
    marginBottom: 4,
  },
  recipeCategory: {
    fontSize: 13,
    color: AbhiColours.primary,
    marginBottom: 2,
    fontWeight: '500',
  },
  recipeArea: {
    fontSize: 12,
    color: AbhiColours.textTertiary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: AbhiColours.textTertiary,
  },
});

export default RecipeListScreen;
