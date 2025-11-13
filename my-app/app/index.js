// app/index.js
import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../providers/AuthProvider'; // 👈 adjust path as needed

export default function Index() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/auth/LoginScreen" />;
  }

  return <Redirect href={user.role === 'vendor' ? '/vendor/dashboard' : '/technician/dashboard'} />;
}