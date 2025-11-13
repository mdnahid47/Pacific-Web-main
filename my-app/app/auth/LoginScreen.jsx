

import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Image, Text, TouchableOpacity, View, Dimensions, Animated, Easing } from 'react-native';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/input';
import { useAuth } from '../../providers/AuthProvider';
import { useEffect, useRef } from 'react';

const { width, height } = Dimensions.get('window');

function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState('');
  const { login, loading } = useAuth();
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(logoScale, {
        toValue: 1,
        duration: 600,
        easing: Easing.elastic(1.2),
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const handleLogin = async () => {
    try {
      const user = await login(email, password);
      router.replace(`/${user.role}/dashboard`);
    } catch (error) {
      alert('Login failed: ' + error.message);
    }
  };

  const handleFocus = (field) => {
    setIsFocused(field);
  };

  const handleBlur = () => {
    setIsFocused('');
  };

  return (
    <View className="flex-1 bg-white">
      {/* Background gradient overlay */}
      <View className="absolute inset-0 bg-gradient-to-b from-olympic to-white opacity-70" />
      
      {/* Futuristic decorative elements */}
      <View className="absolute top-20 right-10 w-24 h-24 rounded-full bg-olympic opacity-20 blur-xl" />
      <View className="absolute bottom-40 left-10 w-32 h-32 rounded-full bg-olympic opacity-15 blur-2xl" />
      
      <View className="flex-1 p-5">
        {/* Logo and title with animation */}
        <Animated.View 
          className="items-center mt-16 mb-10"
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }, { scale: logoScale }]
          }}
        >
          <View className="relative">
            <Image
              source={require('../../assets/icon.png')}
              className="w-32 h-32"
            />
            {/* Glow effect */}
            <View className="absolute inset-0 w-32 h-32 rounded-full bg-violet-200 opacity-30 blur-xl" />
          </View>
          <Text className="text-3xl font-bold mt-4 text-black tracking-wider">Pacific</Text>
          <Text className="text-gray-500 mt-1">Welcome back</Text>
        </Animated.View>

        {/* Form inputs with modern styling */}
        <Animated.View 
          className="space-y-5"
          style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
        >
          <View className={`rounded-2xl p-1 ${isFocused === 'email' ? 'bg-violet-100 shadow-lg' : ''}`}>
            <Input
              label="Email/Phone Number"
              placeholder="your@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              onFocus={() => handleFocus('email')}
              onBlur={handleBlur}
              containerStyle="bg-transparent"
              labelStyle="text-violet-800 font-medium"
              inputStyle="bg-white rounded-xl border border-gray-200 shadow-sm px-4 py-3"
            />
          </View>

          <View className={`rounded-2xl p-1 ${isFocused === 'password' ? 'bg-violet-100 shadow-lg' : ''}`}>
            <Input
              label="Password"
              placeholder="Enter password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              onFocus={() => handleFocus('password')}
              onBlur={handleBlur}
              containerStyle="bg-transparent"
              labelStyle="text-violet-800 font-medium"
              inputStyle="bg-white rounded-xl border border-gray-200 shadow-sm px-4 py-3"
              rightIcon={
                <TouchableOpacity 
                  onPress={() => setShowPassword(!showPassword)}
                  className="p-2"
                >
                  <Ionicons 
                    name={showPassword ? 'eye-off' : 'eye'} 
                    size={20} 
                    color={isFocused === 'password' ? '#7c3aed' : '#666'} 
                  />
                </TouchableOpacity>
              }
            />
          </View>

          {/* Forgot password link */}
          <View className="items-end">
            <Link href="/auth/forgot-password" asChild>
              <TouchableOpacity>
                <Text className="text-olympic font-medium">Forgot Password?</Text>
              </TouchableOpacity>
            </Link>
          </View>

          {/* Modern button with gradient */}
          <View className="mt-4">
            <Button
              title={loading ? 'Logging in...' : 'Login'}
              onPress={handleLogin}
              disabled={loading}
              variant="primary"
              loadingStyle="text-white"
            />
          </View>

          {/* Divider with futuristic styling */}
          <View className="flex-row items-center my-6">
            <View className="flex-1 h-px bg-gray-200" />
            <Text className="mx-4 text-gray-400">OR</Text>
            <View className="flex-1 h-px bg-gray-200" />
          </View>

      

          {/* Register link */}
          <View className="flex-row justify-center mt-2">
            <Text className="text-gray-500">Don't have an account? </Text>
            <Link href="/auth/register/RegisterStep1" asChild>
              <TouchableOpacity>
                <Text className="text-olympic font-medium">Register</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

export default LoginScreen;

