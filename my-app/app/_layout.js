// app/_layout.js
import { Stack } from 'expo-router';
import { View } from 'react-native';
import { Text } from 'react-native';

import { AuthProvider, useAuth } from '../providers/AuthProvider'; // Adjust path
import '../global.css'; // Ensure global styles are imported
function AppContent() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <View >
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="auth/register/RegisterStep1" options={{ headerShown: false }} />
      <Stack.Screen name="auth/register/RegisterStep2" options={{ headerShown: false }} /> 
      <Stack.Screen name="auth/register/RegisterStep4" options={{ headerShown: false }} />
      <Stack.Screen name="auth/register/RegisterSummary" options={{ headerShown: false }} />
      <Stack.Screen name="auth/LoginScreen" options={{ headerShown: false }} />

    </Stack>
  );
}

export default function Layout() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}