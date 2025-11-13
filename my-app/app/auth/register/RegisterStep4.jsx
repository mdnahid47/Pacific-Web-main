import { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator, Alert, Platform, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useVendorData } from '../../../store/useVendorStore';

const RegisterStep4 = () => {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [capturedImages, setCapturedImages] = useState({
    selfie: null,
    nidFront: null,
    nidBack: null,
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data, update } = useVendorData();

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        setHasCameraPermission(status === 'granted');
      } else {
        setHasCameraPermission(false);
      }
    })();
  }, []);

  const takePicture = async (imageType) => {
    if (Platform.OS === 'web') {
      Alert.alert('Error', 'Camera not supported on web');
      return;
    }
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        
        setCapturedImages(prev => ({
          ...prev,
          [imageType]: { uri },
        }));
        
        Alert.alert('Success', `${imageType} image captured successfully!`);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to capture image');
      console.error('Error taking picture:', error);
    }
  };

  const handleNext = () => {
    if (!capturedImages.selfie || !capturedImages.nidFront || !capturedImages.nidBack) {
      Alert.alert('Error', 'Please capture all required images');
      return;
    }
    
    setLoading(true);
    try {
      // স্টোরে আপডেট করো
      update({ 
        kycImages: {
          selfie: capturedImages.selfie.uri,
          nidFront: capturedImages.nidFront.uri,
          nidBack: capturedImages.nidBack.uri
        }
      });
      
      // পরবর্তী স্টেপে যাও
      router.push('/auth/register/RegisterSummary');
    } catch (error) {
      Alert.alert('Error', 'Failed to save images');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const isAllCaptured = capturedImages.selfie && capturedImages.nidFront && capturedImages.nidBack;

  if (hasCameraPermission === null) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (hasCameraPermission === false) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500 text-lg">Camera permission denied or not supported.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1 px-6 py-10" contentContainerStyle={{ paddingBottom: 100 }}>
        <Text className="text-2xl font-bold text-center mb-6">KYC Verification</Text>
        
        {/* Selfie */}
        <Text className="text-base font-semibold mb-2">Selfie Image</Text>
        <TouchableOpacity
          onPress={() => takePicture('selfie')}
          className="w-full h-48 bg-gray-200 rounded-lg justify-center items-center mb-5"
        >
          {capturedImages.selfie ? (
            <Image 
              source={{ uri: capturedImages.selfie.uri }} 
              className="w-full h-full rounded-lg" 
              resizeMode="cover"
            />
          ) : (
            <View className="flex items-center">
              <Ionicons name="camera" size={32} color="#6B7280" className="mb-2" />
              <Text className="text-gray-500">Tap to take selfie</Text>
            </View>
          )}
        </TouchableOpacity>
        
        {/* NID Front */}
        <Text className="text-base font-semibold mb-2">NID Front</Text>
        <TouchableOpacity
          onPress={() => takePicture('nidFront')}
          className="w-full h-48 bg-gray-200 rounded-lg justify-center items-center mb-5"
        >
          {capturedImages.nidFront ? (
            <Image 
              source={{ uri: capturedImages.nidFront.uri }} 
              className="w-full h-full rounded-lg" 
              resizeMode="cover"
            />
          ) : (
            <View className="flex items-center">
              <Ionicons name="camera" size={32} color="#6B7280" className="mb-2" />
              <Text className="text-gray-500">Tap to scan NID front</Text>
            </View>
          )}
        </TouchableOpacity>
        
        {/* NID Back */}
        <Text className="text-base font-semibold mb-2">NID Back</Text>
        <TouchableOpacity
          onPress={() => takePicture('nidBack')}
          className="w-full h-48 bg-gray-200 rounded-lg justify-center items-center mb-6"
        >
          {capturedImages.nidBack ? (
            <Image 
              source={{ uri: capturedImages.nidBack.uri }} 
              className="w-full h-full rounded-lg" 
              resizeMode="cover"
            />
          ) : (
            <View className="flex items-center">
              <Ionicons name="camera" size={32} color="#6B7280" className="mb-2" />
              <Text className="text-gray-500">Tap to scan NID back</Text>
            </View>
          )}
        </TouchableOpacity>
      </ScrollView>
      
      {/* Next Button - Fixed at the bottom */}
      <View className="absolute bottom-0 left-0 right-0 bg-white p-6 border-t border-gray-200">
        <TouchableOpacity
          disabled={!isAllCaptured || loading}
          className={`bg-olympic p-4 rounded-lg ${!isAllCaptured || loading ? 'opacity-50' : ''}`}
          onPress={handleNext}
        >
          <Text className="text-black text-center text-base font-bold">
            {loading ? "Saving..." : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RegisterStep4;