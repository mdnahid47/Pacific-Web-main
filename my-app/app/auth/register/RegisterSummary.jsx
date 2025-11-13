// import { useState } from 'react';
// import { View, Text, ScrollView, Image, TouchableOpacity, Alert, ActivityIndicator , TextInput } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { useRouter } from 'expo-router';
// import { useVendorData } from '../../../store/useVendorStore';


// const RegisterSummary = () => {
//   const router = useRouter();
//   const { data } = useVendorData();
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = () => {
//     setLoading(true);
//     try {
//       Alert.alert('Success', 'Registration completed successfully!');
//       router.push('/auth/login');
//     } catch (error) {
//       Alert.alert('Error', 'Failed to complete registration');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // UI Card Component
//   const ModernCard = ({ title, children, icon }) => (
//     <View className="bg-white rounded-2xl shadow-lg p-5 mb-6 border border-gray-100">
//       <View className="flex-row items-center mb-4">
//         <Ionicons name={icon} size={20} color="#3b82f6" className="mr-2" />
//         <Text className="text-lg font-bold text-gray-800">{title}</Text>
//       </View>
//       {children}
//     </View>
//   );

//   //  Input Field Component
//   const ModernInput = ({ label, value, icon }) => (
//     <View className="mb-4">
//       <View className="flex-row items-center mb-1">
//         <Ionicons name={icon} size={16} color="#6b7280" className="mr-1" />
//         <Text className="text-sm font-medium text-gray-500">{label}</Text>
//       </View>
//       <TextInput
//         value={value || 'N/A'}
//         editable={false}
//         className="text-base text-gray-800 border border-gray-200 rounded-xl px-4 py-3 bg-gray-50"
//       />
//     </View>
//   );

//   return (
//     <View className="flex-1 bg-gray-50">
//       <ScrollView className="flex-1 px-5 py-8" contentContainerStyle={{ paddingBottom: 120 }}>
//         <View className="items-center mb-8">
//           <View className="bg-blue-100 rounded-full p-4 mb-4">
//             <Ionicons name="document-check" size={40} color="#3b82f6" />
//           </View>
//           <Text className="text-3xl font-bold text-gray-800 mb-2">Registration Summary</Text>
//           <Text className="text-gray-500 text-center">Please review your information before submitting</Text>
//         </View>
        
//         {/* Personal Information */}
//         <ModernCard title="Personal Information" icon="person">
//           <ModernInput label="Name" value={data?.name} icon="person" />
//           <ModernInput label="Email" value={data?.email} icon="mail" />
//           <ModernInput label="Phone" value={data?.phone} icon="call" />
//           <ModernInput 
//             label="Date of Birth" 
//             value={data?.dob ? new Date(data.dob).toDateString() : ''} 
//             icon="calendar" 
//           />
//           <ModernInput label="Address" value={data?.address} icon="location" />
//           <ModernInput label="Division" value={data?.divisionValue} icon="location" />
//           <ModernInput label="District" value={data?.districtValue} icon="location" />
//           <ModernInput label="Thana" value={data?.thanaValue} icon="location" />
//         </ModernCard>
        
//         {/* KYC Images */}
//         <ModernCard title="KYC Verification" icon="shield-checkmark">
//           <View className="mb-5">
//             <View className="flex-row items-center mb-2">
//               <Ionicons name="camera" size={16} color="#6b7280" className="mr-1" />
//               <Text className="text-sm font-medium text-gray-500">Selfie</Text>
//             </View>
//             {data?.kycImages?.selfie ? (
//               <Image 
//                 source={{ uri: data.kycImages.selfie }} 
//                 className="w-full h-40 rounded-xl" 
//                 resizeMode="cover"
//               />
//             ) : (
//               <View className="bg-gray-100 h-40 rounded-xl flex items-center justify-center">
//                 <Text className="text-gray-500">Not provided</Text>
//               </View>
//             )}
//           </View>
          
//           <View className="mb-5">
//             <View className="flex-row items-center mb-2">
//               <Ionicons name="card" size={16} color="#6b7280" className="mr-1" />
//               <Text className="text-sm font-medium text-gray-500">NID Front</Text>
//             </View>
//             {data?.kycImages?.nidFront ? (
//               <Image 
//                 source={{ uri: data.kycImages.nidFront }} 
//                 className="w-full h-40 rounded-xl" 
//                 resizeMode="cover"
//               />
//             ) : (
//               <View className="bg-gray-100 h-40 rounded-xl flex items-center justify-center">
//                 <Text className="text-gray-500">Not provided</Text>
//               </View>
//             )}
//           </View>
          
//           <View>
//             <View className="flex-row items-center mb-2">
//               <Ionicons name="card" size={16} color="#6b7280" className="mr-1" />
//               <Text className="text-sm font-medium text-gray-500">NID Back</Text>
//             </View>
//             {data?.kycImages?.nidBack ? (
//               <Image 
//                 source={{ uri: data.kycImages.nidBack }} 
//                 className="w-full h-40 rounded-xl" 
//                 resizeMode="cover"
//               />
//             ) : (
//               <View className="bg-gray-100 h-40 rounded-xl flex items-center justify-center">
//                 <Text className="text-gray-500">Not provided</Text>
//               </View>
//             )}
//           </View>
//         </ModernCard>
//       </ScrollView>
      
//       {/* Submit Button - Fixed at the bottom */}
//       <View className="absolute bottom-0 left-0 right-0 bg-white p-5 border-t border-gray-200 shadow-lg">
//         <TouchableOpacity
//           disabled={loading}
//           className={`bg-olympic py-4 rounded-xl flex-row items-center justify-center ${loading ? 'opacity-70' : ''}`}
//           onPress={handleSubmit}
//         >
//           {loading ? (
//             <ActivityIndicator size="small" color="white" />
//           ) : (
//             <>
//               <Ionicons name="checkmark-circle" size={20} color="white" />
//               <Text className="text-white text-center text-base font-bold  ml-2">
//                 Submit Registration
//               </Text>
//             </>
//           )}
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// export default RegisterSummary;

import { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Alert, ActivityIndicator, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useVendorData } from '../../../store/useVendorStore';
import axios from 'axios';

const RegisterSummary = () => {
  const router = useRouter();
  const { data } = useVendorData();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // formData create
      const formData = new FormData();
      
      // text data add 
      formData.append('name', data?.name || '');
      formData.append('email', data?.email || '');
      formData.append('phone', data?.phone || '');
      formData.append('dob', data?.dob || '');
      formData.append('password', data?.password || ''); // পাসওয়ার্ড যোগ করুন
      formData.append('nid_number', data?.nidNumber || ''); // NID নম্বর যোগ করুন
      formData.append('address', data?.address || '');
      formData.append('technician_quantity', data?.technicianQuantity || '0');
      
      // image data add
      if (data?.kycImages?.selfie) {
        const selfieUri = data.kycImages.selfie;
        const selfieName = selfieUri.split('/').pop();
        const selfieType = selfieUri.split('.').pop();
        
        formData.append('profile_image', {
          uri: selfieUri,
          type: `image/${selfieType}`,
          name: selfieName,
        });
      }
      
      if (data?.kycImages?.nidFront) {
        const nidFrontUri = data.kycImages.nidFront;
        const nidFrontName = nidFrontUri.split('/').pop();
        const nidFrontType = nidFrontUri.split('.').pop();
        
        formData.append('nid_front', {
          uri: nidFrontUri,
          type: `image/${nidFrontType}`,
          name: nidFrontName,
        });
      }
      
      if (data?.kycImages?.nidBack) {
        const nidBackUri = data.kycImages.nidBack;
        const nidBackName = nidBackUri.split('/').pop();
        const nidBackType = nidBackUri.split('.').pop();
        
        formData.append('nid_back', {
          uri: nidBackUri,
          type: `image/${nidBackType}`,
          name: nidBackName,
        });
      }

      // send data to server
      const response = await axios.post('http://localhost:5001/api/vendor/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000, // 30 seconds timeout
      });

      // On success
      if (response.data.success) {
        Alert.alert('Success', response.data.message || 'Registration completed successfully!');
        router.push('/auth/login');
      } else {
        Alert.alert('Error', response.data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Error', 
        error.response?.data?.message || 
        error.message || 
        'Failed to complete registration'
      );
    } finally {
      setLoading(false);
    }
  };

  // UI Card Component
  const ModernCard = ({ title, children, icon }) => (
    <View className="bg-white rounded-2xl shadow-lg p-5 mb-6 border border-gray-100">
      <View className="flex-row items-center mb-4">
        <Ionicons name={icon} size={20} color="#3b82f6" className="mr-2" />
        <Text className="text-lg font-bold text-gray-800">{title}</Text>
      </View>
      {children}
    </View>
  );

  //  Input Field Component
  const ModernInput = ({ label, value, icon }) => (
    <View className="mb-4">
      <View className="flex-row items-center mb-1">
        <Ionicons name={icon} size={16} color="#6b7280" className="mr-1" />
        <Text className="text-sm font-medium text-gray-500">{label}</Text>
      </View>
      <TextInput
        value={value || 'N/A'}
        editable={false}
        className="text-base text-gray-800 border border-gray-200 rounded-xl px-4 py-3 bg-gray-50"
      />
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-5 py-8" contentContainerStyle={{ paddingBottom: 120 }}>
        <View className="items-center mb-8">
          <View className="bg-blue-100 rounded-full p-4 mb-4">
            <Ionicons name="document-check" size={40} color="#3b82f6" />
          </View>
          <Text className="text-3xl font-bold text-gray-800 mb-2">Registration Summary</Text>
          <Text className="text-gray-500 text-center">Please review your information before submitting</Text>
        </View>
        
        {/* Personal Information */}
        <ModernCard title="Personal Information" icon="person">
          <ModernInput label="Name" value={data?.name} icon="person" />
          <ModernInput label="Email" value={data?.email} icon="mail" />
          <ModernInput label="Phone" value={data?.phone} icon="call" />
          <ModernInput 
            label="Date of Birth" 
            value={data?.dob ? new Date(data.dob).toDateString() : ''} 
            icon="calendar" 
          />
          <ModernInput label="Address" value={data?.address} icon="location" />
          <ModernInput label="Division" value={data?.divisionValue} icon="location" />
          <ModernInput label="District" value={data?.districtValue} icon="location" />
          <ModernInput label="Thana" value={data?.thanaValue} icon="location" />
        </ModernCard>
        
        {/* KYC Images */}
        <ModernCard title="KYC Verification" icon="shield-checkmark">
          <View className="mb-5">
            <View className="flex-row items-center mb-2">
              <Ionicons name="camera" size={16} color="#6b7280" className="mr-1" />
              <Text className="text-sm font-medium text-gray-500">Selfie</Text>
            </View>
            {data?.kycImages?.selfie ? (
              <Image 
                source={{ uri: data.kycImages.selfie }} 
                className="w-full h-40 rounded-xl" 
                resizeMode="cover"
              />
            ) : (
              <View className="bg-gray-100 h-40 rounded-xl flex items-center justify-center">
                <Text className="text-gray-500">Not provided</Text>
              </View>
            )}
          </View>
          
          <View className="mb-5">
            <View className="flex-row items-center mb-2">
              <Ionicons name="card" size={16} color="#6b7280" className="mr-1" />
              <Text className="text-sm font-medium text-gray-500">NID Front</Text>
            </View>
            {data?.kycImages?.nidFront ? (
              <Image 
                source={{ uri: data.kycImages.nidFront }} 
                className="w-full h-40 rounded-xl" 
                resizeMode="cover"
              />
            ) : (
              <View className="bg-gray-100 h-40 rounded-xl flex items-center justify-center">
                <Text className="text-gray-500">Not provided</Text>
              </View>
            )}
          </View>
          
          <View>
            <View className="flex-row items-center mb-2">
              <Ionicons name="card" size={16} color="#6b7280" className="mr-1" />
              <Text className="text-sm font-medium text-gray-500">NID Back</Text>
            </View>
            {data?.kycImages?.nidBack ? (
              <Image 
                source={{ uri: data.kycImages.nidBack }} 
                className="w-full h-40 rounded-xl" 
                resizeMode="cover"
              />
            ) : (
              <View className="bg-gray-100 h-40 rounded-xl flex items-center justify-center">
                <Text className="text-gray-500">Not provided</Text>
              </View>
            )}
          </View>
        </ModernCard>
      </ScrollView>
      
      {/* Submit Button - Fixed at the bottom */}
      <View className="absolute bottom-0 left-0 right-0 bg-white p-5 border-t border-gray-200 shadow-lg">
        <TouchableOpacity
          disabled={loading}
          className={`bg-blue-600 py-4 rounded-xl flex-row items-center justify-center ${loading ? 'opacity-70' : ''}`}
          onPress={handleSubmit}
        >
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={20} color="white" />
              <Text className="text-white text-center text-base font-bold  ml-2">
                Submit Registration
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RegisterSummary;