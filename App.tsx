import React from 'react';
import { StatusBar, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LoginScreen from './src/screens/LoginScreen';
import RecipeListScreen from './src/screens/RecipeListScreen';
import RecipeDetailScreen from './src/screens/RecipeDetailScreen';

export type RootStackParamList = {
  Login: undefined;
  RecipeList: undefined;
  RecipeDetail: { recipeId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar barStyle="dark-content" backgroundColor="#FF6B6B" />
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#FF6B6B',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: '700',
              fontSize: 18,
            },
            headerShadowVisible: false,
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="RecipeList"
            component={RecipeListScreen}
            options={({ navigation }) => ({
              title: 'Foodie',
              headerLargeTitle: false,
              headerBackVisible: false,
              headerRight: () => (
                <TouchableOpacity
                  style={styles.logoutButton}
                  onPress={() => navigation.navigate('Login')}
                >
                  <Text style={styles.logoutButtonText}>Logout</Text>
                </TouchableOpacity>
              ),
            })}
          />
          <Stack.Screen
            name="RecipeDetail"
            component={RecipeDetailScreen}
            options={{
              title: 'Recipe Details',
              headerBackTitle: 'Back',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  logoutButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 8,
  },
  logoutButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});
