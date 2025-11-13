import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Image,
  Animated,
  Linking,
} from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AbhiColours from '../abhi-colours';

type RootStackParamList = {
  Login: undefined;
  RecipeList: undefined;
};

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Create a looping blinking animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [glowAnim]);

  const handleSignIn = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Success', 'Logged in successfully!', [
        { text: 'OK', onPress: () => navigation.navigate('RecipeList') },
      ]);
    }, 1000);
  };

  const handleGoogleSignIn = () => {
    Alert.alert('This is in progress', 'Got few bug :( \nWorking on it... 😊');
  };

  const handleSkipLogin = () => {
    navigation.navigate('RecipeList');
  };

  const handleAbhishekPress = async () => {
    const linkedInUrl = 'https://in.linkedin.com/in/abhishek-gadad';
    try {
      const supported = await Linking.canOpenURL(linkedInUrl);
      if (supported) {
        await Linking.openURL(linkedInUrl);
      } else {
        Alert.alert('Error', 'Cannot open LinkedIn profile');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open LinkedIn profile');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Foodie</Text>
            <Text style={styles.subtitle}>Can you sign in Chef </Text>
          </View>

          {/* Login Form */}
          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
              placeholderTextColor="#999"
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              placeholderTextColor="#999"
            />

            <TouchableOpacity
              style={styles.signInButton}
              onPress={handleSignIn}
              disabled={loading}
            >
              <Text style={styles.signInButtonText}>
                {loading ? 'Signing In...' : 'Sign In'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.divider} />
          </View>

          {/* Google Sign In Options */}
          <View style={styles.googleContainer}>
            <TouchableOpacity
              style={styles.googleButton}
              onPress={handleGoogleSignIn}
            >
              <View style={styles.googleIconContainer}>
                <Image
                  source={require('../assets/google-logo.png')}
                  style={styles.googleLogo}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.googleButtonText}>Sign in with Google</Text>
            </TouchableOpacity>
          </View>

          {/* Skip Login Button */}
          <TouchableOpacity
            style={styles.skipButton}
            onPress={handleSkipLogin}
          >
            <Animated.View
              style={[
                styles.skipButtonGlow,
                {
                  borderColor: glowAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [AbhiColours.primaryDark, AbhiColours.primary],
                  }),
                  borderWidth: glowAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [2, 4],
                  }),
                },
              ]}
            >
              <Text style={styles.skipButtonText}>Skip Login</Text>
            </Animated.View>
          </TouchableOpacity>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>A creation by </Text>
            <TouchableOpacity onPress={handleAbhishekPress}>
              <Text style={styles.footerLink}>Abhishek</Text>
            </TouchableOpacity>
          </View>
          
          {/* Powered By Text */}
          <View style={styles.poweredByContainer}>
            <Text style={styles.poweredByText}>Powered by React Native + MERN</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AbhiColours.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: AbhiColours.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: AbhiColours.textSecondary,
  },
  formContainer: {
    marginBottom: 24,
  },
  input: {
    height: 50,
    backgroundColor: AbhiColours.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: AbhiColours.textPrimary,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: AbhiColours.border,
  },
  signInButton: {
    height: 50,
    backgroundColor: AbhiColours.buttonPrimary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    elevation: 2,
    shadowColor: AbhiColours.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  signInButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: AbhiColours.white,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: AbhiColours.divider,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: AbhiColours.textTertiary,
    fontWeight: '500',
  },
  googleContainer: {
    marginBottom: 24,
  },
  googleButton: {
    height: 56,
    backgroundColor: AbhiColours.white,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 3,
    shadowColor: AbhiColours.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: AbhiColours.border,
  },
  googleButtonSecondary: {
    backgroundColor: AbhiColours.white,
    borderWidth: 1,
    borderColor: AbhiColours.border,
  },
  googleIconContainer: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  googleLogo: {
    width: 24,
    height: 24,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: AbhiColours.textPrimary,
    flex: 1,
    textAlign: 'center',
    marginRight: 48,
  },
  googleButtonTextSecondary: {
    fontSize: 16,
    fontWeight: '600',
    color: AbhiColours.textPrimary,
    flex: 1,
    textAlign: 'center',
    marginRight: 48,
  },
  skipButton: {
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  skipButtonGlow: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: AbhiColours.primaryLight,
    borderWidth: 2,
    borderColor: AbhiColours.primaryDark,
  },
  skipButtonText: {
    fontSize: 16,
    color: AbhiColours.white,
    fontWeight: '700',
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
  },
  footerText: {
    fontSize: 14,
    color: AbhiColours.textSecondary,
  },
  footerLink: {
    fontSize: 14,
    color: AbhiColours.primary,
    fontWeight: '600',
  },
  poweredByContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  poweredByText: {
    fontSize: 12,
    color: AbhiColours.textTertiary,
    fontStyle: 'italic',
  },
});

export default LoginScreen;
