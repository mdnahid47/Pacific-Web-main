// import { MaterialIcons } from '@expo/vector-icons';
// import { router, useLocalSearchParams } from 'expo-router';
// import { useState } from 'react';
// import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
// import Button from '../../../components/ui/Button';
// import { useVendorData } from '../../../store/useVendorStore';

// // Define Olympic blue as primary color
// const PRIMARY_COLOR = '#0085C7';
// const LIGHT_BLUE = '#E6F2F8';
// const BORDER_COLOR = '#D1E7F5';

// function RegisterStep2() {
//   const params = useLocalSearchParams();
//   const { data, update } = useVendorData();
//   const [password, setPassword] = useState(data?.password || '');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const validate = () => {
//     if (password.length < 6) {
//       Alert.alert('Error', 'Password must be at least 6 characters');
//       return false;
//     }
//     if (password !== confirmPassword) {
//       Alert.alert('Error', 'Passwords do not match');
//       return false;
//     }
//     return true;
//   };

//   const handleNext = () => {
//     if (!validate()) return;
//     setLoading(true);
//     try {
//       // লোকাল স্টোরে আপডেট করো
//       update({ password });
//       // পরবর্তী স্টেপে যাও
//       router.push('/auth/register/RegisterStep4');
//     } catch (error) {
//       Alert.alert('Error', 'Failed to save password');
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//       className="flex-1 bg-gray-50"
//     >
//       <ScrollView 
//         keyboardShouldPersistTaps="handled"
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{ padding: 20, paddingBottom: 30 }}
//       >
//         <Text className="text-3xl font-bold mb-8 mt-5 text-center" style={{ color: PRIMARY_COLOR }}>Vendor Registration</Text>
        
//         {/* Password Creation Section */}
//         <View className="bg-white rounded-xl shadow-md p-5 mb-6">
//           <View className="flex-row items-center mb-6">
//             <View className="w-8 h-8 rounded-full items-center justify-center mr-3" style={{ backgroundColor: LIGHT_BLUE }}>
//               <Text className="font-bold" style={{ color: PRIMARY_COLOR }}>6</Text>
//             </View>
//             <Text className="text-xl font-bold" style={{ color: PRIMARY_COLOR }}>Create Password</Text>
//           </View>
          
//           <Text className="text-gray-600 mb-6">Set a secure password for your account</Text>
          
//           <View className="mb-6">
//             <Text className="text-gray-700 mb-2 text-base">Password</Text>
//             <View className="relative">
//               <TextInput
//                 placeholder="Enter your password"
//                 value={password}
//                 onChangeText={setPassword}
//                 secureTextEntry={!showPassword}
//                 className="border border-gray-300 p-3 rounded-lg text-base text-black pr-10"
//                 placeholderTextColor="#9ca3af"
//               />
//               <TouchableOpacity 
//                 onPress={() => setShowPassword(!showPassword)}
//                 className="absolute right-3 top-3"
//               >
//                 <MaterialIcons 
//                   name={showPassword ? 'visibility' : 'visibility-off'} 
//                   size={20} 
//                   color="#6b7280" 
//                 />
//               </TouchableOpacity>
//             </View>
//             <Text className="text-xs text-gray-500 mt-1">Minimum 6 characters</Text>
//           </View>
          
//           <View className="mb-6">
//             <Text className="text-gray-700 mb-2 text-base">Confirm Password</Text>
//             <View className="relative">
//               <TextInput
//                 placeholder="Re-enter your password"
//                 value={confirmPassword}
//                 onChangeText={setConfirmPassword}
//                 secureTextEntry={!showConfirmPassword}
//                 className="border border-gray-300 p-3 rounded-lg text-base text-black pr-10"
//                 placeholderTextColor="#9ca3af"
//               />
//               <TouchableOpacity 
//                 onPress={() => setShowConfirmPassword(!showConfirmPassword)}
//                 className="absolute right-3 top-3"
//               >
//                 <MaterialIcons 
//                   name={showConfirmPassword ? 'visibility' : 'visibility-off'} 
//                   size={20} 
//                   color="#6b7280" 
//                 />
//               </TouchableOpacity>
//             </View>
//           </View>
          
//           {/* Password Requirements */}
//           <View className="bg-blue-50 rounded-lg p-4 mb-4">
//             <Text className="text-sm font-medium mb-2" style={{ color: PRIMARY_COLOR }}>Password Requirements:</Text>
//             <View className="flex-row items-start mb-1">
//               <MaterialIcons name="check-circle" size={16} color="#10B981" className="mr-2 mt-0.5" />
//               <Text className="text-sm text-gray-700">At least 6 characters long</Text>
//             </View>
//             <View className="flex-row items-start">
//               <MaterialIcons name="check-circle" size={16} color="#10B981" className="mr-2 mt-0.5" />
//               <Text className="text-sm text-gray-700">Contains letters and numbers</Text>
//             </View>
//           </View>
//         </View>
        
//         <Button 
//           title={loading ? "Saving..." : "Next"} 
//           onPress={handleNext}
//           disabled={loading}
//           className="mt-2 rounded-xl py-4"
//           style={{ backgroundColor: PRIMARY_COLOR }}
//         />
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// }

// export default RegisterStep2;

import { MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Button from '../../../components/ui/Button';
import { useVendorData } from '../../../store/useVendorStore';

// Define Olympic blue as primary color
const PRIMARY_COLOR = '#0085C7';
const LIGHT_BLUE = '#E6F2F8';
const BORDER_COLOR = '#D1E7F5';

function RegisterStep2() {
  const params = useLocalSearchParams();
  const { data, update } = useVendorData();
  const [password, setPassword] = useState(data?.password || '');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check if password meets requirements
  const hasMinLength = password.length >= 6;
  const hasLettersAndNumbers = /[a-zA-Z]/.test(password) && /[0-9]/.test(password);

  const validate = () => {
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return false;
    }
    if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
      Alert.alert('Error', 'Password must contain both letters and numbers');
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (!validate()) return;
    setLoading(true);
    try {
      // লোকাল স্টোরে আপডেট করো
      update({ password });
      // পরবর্তী স্টেপে যাও
      router.push('/auth/register/RegisterStep4');
    } catch (error) {
      Alert.alert('Error', 'Failed to save password');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-gray-50"
    >
      <ScrollView 
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 30 }}
      >
        <Text className="text-3xl font-bold mb-8 mt-5 text-center" style={{ color: PRIMARY_COLOR }}>Vendor Registration</Text>
        
        {/* Password Creation Section */}
        <View className="bg-white rounded-xl shadow-md p-5 mb-6">
          <View className="flex-row items-center mb-6">
            <View className="w-8 h-8 rounded-full items-center justify-center mr-3" style={{ backgroundColor: LIGHT_BLUE }}>
              <Text className="font-bold" style={{ color: PRIMARY_COLOR }}>6</Text>
            </View>
            <Text className="text-xl font-bold" style={{ color: PRIMARY_COLOR }}>Create Password</Text>
          </View>
          
          <Text className="text-gray-600 mb-6">Set a secure password for your account</Text>
          
          <View className="mb-6">
            <Text className="text-gray-700 mb-2 text-base">Password</Text>
            <View className="relative">
              <TextInput
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                className="border border-gray-300 p-3 rounded-lg text-base text-black pr-10"
                placeholderTextColor="#9ca3af"
              />
              <TouchableOpacity 
                onPress={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3"
              >
                <MaterialIcons 
                  name={showPassword ? 'visibility' : 'visibility-off'} 
                  size={20} 
                  color="#6b7280" 
                />
              </TouchableOpacity>
            </View>
            <Text className="text-xs text-gray-500 mt-1">Minimum 6 characters</Text>
          </View>
          
          <View className="mb-6">
            <Text className="text-gray-700 mb-2 text-base">Confirm Password</Text>
            <View className="relative">
              <TextInput
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                className="border border-gray-300 p-3 rounded-lg text-base text-black pr-10"
                placeholderTextColor="#9ca3af"
              />
              <TouchableOpacity 
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3"
              >
                <MaterialIcons 
                  name={showConfirmPassword ? 'visibility' : 'visibility-off'} 
                  size={20} 
                  color="#6b7280" 
                />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Password Requirements */}
          <View className="bg-blue-50 rounded-lg p-4 mb-4">
            <Text className="text-sm font-medium mb-2" style={{ color: PRIMARY_COLOR }}>Password Requirements:</Text>
            <View className="flex-row items-start mb-1">
              <MaterialIcons 
                name={hasMinLength ? "check-circle" : "radio-button-unchecked"} 
                size={16} 
                color={hasMinLength ? "#10B981" : "#9CA3AF"} 
                className="mr-2 mt-0.5" 
              />
              <Text className={`text-sm ${hasMinLength ? 'text-gray-700' : 'text-gray-500'}`}>
                At least 6 characters long
              </Text>
            </View>
            <View className="flex-row items-start">
              <MaterialIcons 
                name={hasLettersAndNumbers ? "check-circle" : "radio-button-unchecked"} 
                size={16} 
                color={hasLettersAndNumbers ? "#10B981" : "#9CA3AF"} 
                className="mr-2 mt-0.5" 
              />
              <Text className={`text-sm ${hasLettersAndNumbers ? 'text-gray-700' : 'text-gray-500'}`}>
                Contains letters and numbers
              </Text>
            </View>
          </View>
        </View>
        
        <Button 
          title={loading ? "Saving..." : "Next"} 
          onPress={handleNext}
          disabled={loading}
          className="mt-2 rounded-xl py-4"
          style={{ backgroundColor: PRIMARY_COLOR }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default RegisterStep2;