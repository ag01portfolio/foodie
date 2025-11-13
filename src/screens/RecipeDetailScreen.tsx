import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import apiService from '../services/apiService';
import { RecipeDetail } from '../types/recipe';

type RootStackParamList = {
  RecipeList: undefined;
  RecipeDetail: { recipeId: string };
};

type RecipeDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'RecipeDetail'>;

const { width } = Dimensions.get('window');

const RecipeDetailScreen: React.FC<RecipeDetailScreenProps> = ({ route }) => {
  const { recipeId } = route.params;
  const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecipeDetail();
  }, [recipeId]);

  const loadRecipeDetail = async () => {
    try {
      setLoading(true);
      const data = await apiService.getRecipeDetail(recipeId);
      setRecipe(data);
    } catch (error) {
      console.log(' Abhi   x-x--x-xx-x-  Error loading recipe detail:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
        <Text style={styles.loadingText}>Loading recipe...</Text>
      </View>
    );
  }

  if (!recipe) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Recipe not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Large Recipe Image */}
      <FastImage
        source={{ uri: recipe.thumbnail, priority: FastImage.priority.high }}
        style={styles.heroImage}
        resizeMode={FastImage.resizeMode.cover}
      />

      {/* Recipe Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{recipe.name}</Text>
        <View style={styles.metaContainer}>
          {recipe.category && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{recipe.category}</Text>
            </View>
          )}
          {recipe.area && (
            <View style={[styles.badge, styles.badgeSecondary]}>
              <Text style={styles.badgeText}>{recipe.area}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Ingredients Section */}
      {recipe.ingredients && recipe.ingredients.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          <View style={styles.ingredientsContainer}>
            {recipe.ingredients.map((item, index) => (
              <View key={index} style={styles.ingredientRow}>
                <View style={styles.bulletPoint} />
                <Text style={styles.ingredientText}>
                  <Text style={styles.ingredientMeasure}>{item.measure}</Text>
                  {' '}
                  <Text style={styles.ingredientName}>{item.ingredient}</Text>
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Instructions Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Instructions</Text>
        <Text style={styles.instructionsText}>{recipe.instructions}</Text>
      </View>

      {/* Tags Section */}
      {recipe.tags && recipe.tags.length > 0 && recipe.tags[0] !== '' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tags</Text>
          <View style={styles.tagsContainer}>
            {recipe.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag.trim()}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Bottom Spacing */}
      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 18,
    color: '#999',
  },
  heroImage: {
    width: width,
    height: width * 0.75,
    backgroundColor: '#E0E0E0',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
    lineHeight: 34,
  },
  metaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badge: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  badgeSecondary: {
    backgroundColor: '#4ECDC4',
  },
  badgeText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 12,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  ingredientsContainer: {
    gap: 10,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 4,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF6B6B',
    marginTop: 7,
    marginRight: 12,
  },
  ingredientText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  ingredientMeasure: {
    fontWeight: '600',
    color: '#FF6B6B',
  },
  ingredientName: {
    color: '#555',
  },
  instructionsText: {
    fontSize: 16,
    lineHeight: 26,
    color: '#444',
    textAlign: 'justify',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  tagText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  bottomSpacer: {
    height: 40,
  },
});

export default RecipeDetailScreen;
