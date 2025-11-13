// import DateTimePicker from '@react-native-community/datetimepicker';
// import { router } from 'expo-router';
// import { useEffect, useState, useCallback } from 'react';
// import {
//   Alert,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   Text,
//   TextInput,
//   TouchableOpacity,
// } from 'react-native';
// import { AddressDropdown } from '../../../components/ui/AddressDropdown';
// import Button from '../../../components/ui/Button';
// import { districts, divisions, thanas } from '../../../utils/addressData';
// import { useVendorData } from '../../../store/useVendorStore';

// function RegisterStep1() {
//   // সরাসরি Zustand থেকে data ও update আলাদা আলাদা নেওয়া
//   const data = useVendorData(state => state.data);
//   const update = useVendorData(state => state.update);

//   // Form data state
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     address: '',
//   });

//   // Date of birth
//   const [dob, setDob] = useState(new Date());
//   const [showDatePicker, setShowDatePicker] = useState(false);

//   // Address selections
//   const [selectedDivision, setSelectedDivision] = useState(null);
//   const [selectedDistrict, setSelectedDistrict] = useState(null);
//   const [selectedThana, setSelectedThana] = useState(null);

//   // Available options based on selections
//   const [availableDistricts, setAvailableDistricts] = useState([]);
//   const [availableThanas, setAvailableThanas] = useState([]);

//   const [loading, setLoading] = useState(false);

//   // Initialize form data from store
//  useEffect(() => {
//   if (!data) return;

//   setFormData({
//     name: data.name || '',
//     email: data.email || '',
//     phone: data.phone || '',
//     address: data.address || '',
//   });

//   if (data.dob) setDob(new Date(data.dob));

//   if (data.divisionKey) {
//     setSelectedDivision(data.divisionKey);
//     setAvailableDistricts(districts[data.divisionKey] || []);
//   }

//   if (data.districtKey) {
//     setSelectedDistrict(data.districtKey);
//     setAvailableThanas(thanas[data.districtKey] || []);
//   }

//   if (data.thanaKey) {
//     setSelectedThana(data.thanaKey);
//   }
// }, [data]);

// // Division select handler
// const handleDivisionSelect = (divisionKey) => {
//   const divisionObj = divisions.find(d => d.key === divisionKey) || { value: '' };
//   update({
//     divisionKey,
//     divisionValue: divisionObj.value,
//     districtKey: '',
//     districtValue: '',
//     thanaKey: '',
//     thanaValue: '',
//   });
// };

// // District select handler
// const handleDistrictSelect = (districtKey) => {
//   const districtList = districts[data.divisionKey] || [];
//   const districtObj = districtList.find(d => d.key === districtKey) || { value: '' };
//   update({
//     districtKey,
//     districtValue: districtObj.value,
//     thanaKey: '',
//     thanaValue: '',
//   });
// };

// // Thana select handler
// const handleThanaSelect = (thanaKey) => {
//   const thanaList = thanas[data.districtKey] || [];
//   const thanaObj = thanaList.find(t => t.key === thanaKey) || { value: '' };
//   update({
//     thanaKey,
//     thanaValue: thanaObj.value,
//   });
// };


//   const handleInputChange = useCallback((field, value) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//   }, []);

//   const onChangeDate = useCallback((event, selectedDate) => {
//     if (event.type === 'set') {
//       setDob(selectedDate || dob);
//       if (Platform.OS === 'android') setShowDatePicker(false);
//     } else {
//       setShowDatePicker(false);
//     }
//   }, [dob]);

//   const validate = useCallback(() => {
//     if (!formData.name || formData.name.length < 3) {
//       Alert.alert('Invalid Name', 'Name must be at least 3 characters');
//       return false;
//     }
//     if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
//       Alert.alert('Invalid Email', 'Please enter a valid email address');
//       return false;
//     }
//     if (!/^(?:\+88|01)?\d{11}$/.test(formData.phone)) {
//       Alert.alert('Invalid Phone', 'Please enter a valid Bangladeshi phone number');
//       return false;
//     }
//     const age = new Date().getFullYear() - dob.getFullYear();
//     if (age < 18) {
//       Alert.alert('Age Restriction', 'You must be at least 18 years old');
//       return false;
//     }
//     if (!formData.address || !selectedDivision || !selectedDistrict || !selectedThana) {
//       Alert.alert('Missing Information', 'Please fill all address fields');
//       return false;
//     }
//     return true;
//   }, [formData, dob, selectedDivision, selectedDistrict, selectedThana]);

//   const handleNext = useCallback(async () => {
//     if (!validate()) return;

//     setLoading(true);
//     try {
//       const payload = {
//         ...formData,
//         dob: dob.toISOString(),
//         divisionKey: selectedDivision,
//         districtKey: selectedDistrict,
//         thanaKey: selectedThana,
//       };

//       await update(payload);
//       router.push('/auth/register/RegisterStep2');
//     } catch (error) {
//       Alert.alert('Error', 'Failed to proceed to next step');
//       console.error('Registration Error:', error);
//     } finally {
//       setLoading(false);
//     }
//   }, [formData, dob, selectedDivision, selectedDistrict, selectedThana, validate, update]);

//   return (
//     <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
//       <ScrollView className="flex-1 p-4 bg-white" contentContainerStyle={{ paddingBottom: 20 }}>
//         <Text className="text-2xl font-bold mb-8 mt-5">Personal Information</Text>

//         <TextInput
//   placeholder="Full Name"
//   placeholderTextColor="#999"
//   value={formData.name}
//   onChangeText={(text) => handleInputChange('name', text)}
//   className="border border-gray-300 p-3 mb-4 rounded text-black"
// />

// <TextInput
//   placeholder="Email"
//   placeholderTextColor="#999"
//   value={formData.email}
//   onChangeText={(text) => handleInputChange('email', text)}
//   keyboardType="email-address"
//   autoCapitalize="none"
//   className="border border-gray-300 p-3 mb-4 rounded text-black"
// />

// <TextInput
//   placeholder="Phone Number"
//   placeholderTextColor="#999"
//   value={formData.phone}
//   onChangeText={(text) => handleInputChange('phone', text)}
//   keyboardType="phone-pad"
//   className="border border-gray-300 p-3 mb-4 rounded text-black"
// />


//         <TouchableOpacity onPress={() => setShowDatePicker(true)} className="border border-gray-300 p-3 mb-4 rounded justify-center">
//           <Text>{dob.toDateString()}</Text>
//         </TouchableOpacity>

//         {showDatePicker && (
//           <DateTimePicker
//             value={dob}
//             mode="date"
//             display={Platform.OS === 'ios' ? 'spinner' : 'default'}
//             onChange={onChangeDate}
//             maximumDate={new Date()}
//           />
//         )}

//         <Text className="text-lg font-semibold mt-6 mb-4">Address Information</Text>
          
// <TextInput
//   placeholder="Full Address (House/Road No)"
//   placeholderTextColor="#999"
//   value={formData.address}
//   onChangeText={(text) => handleInputChange('address', text)}
//   multiline
//   numberOfLines={3}
//   className="border border-gray-300 p-3 mb-4 rounded text-black h-20 text-base"
// />

       

//         <AddressDropdown
//           label="Division"
//           data={divisions}
//           onSelect={handleDivisionSelect}
//           placeholder="Select Division"
//           defaultOption={selectedDivision}
//         />

//         <AddressDropdown
//           label="District"
//           data={availableDistricts}
//           onSelect={handleDistrictSelect}
//           placeholder={selectedDivision ? 'Select District' : 'First select Division'}
//           disabled={!selectedDivision}
//           defaultOption={selectedDistrict}
//         />

//         <AddressDropdown
//           label="Thana/Police Station"
//           data={availableThanas}
//           onSelect={handleThanaSelect}
//           placeholder={selectedDistrict ? 'Select Thana' : 'First select District'}
//           disabled={!selectedDistrict}
//           defaultOption={selectedThana}
//         />

//         <Button
//           title={loading ? 'Submitting...' : 'Next'}
//           onPress={handleNext}
//           disabled={loading}
//           className="mt-6"
//         />


//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// }

// export default RegisterStep1;
// import DateTimePicker from '@react-native-community/datetimepicker';
// import { router } from 'expo-router';
// import { useEffect, useState, useCallback } from 'react';
// import {
//   Alert,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import { AddressDropdown } from '../../../components/ui/AddressDropdown';
// import Button from '../../../components/ui/Button';
// import { districts, divisions, thanas } from '../../../utils/addressData';
// import { useVendorData } from '../../../store/useVendorStore';
// import * as DocumentPicker from 'expo-document-picker';

// function RegisterStep1() {
//   // সরাসরি Zustand থেকে data ও update আলাদা আলাদা নেওয়া
//   const data = useVendorData(state => state.data);
//   const update = useVendorData(state => state.update);
  
//   // Form data state
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     address: '',
//   });
  
//   // Date of birth
//   const [dob, setDob] = useState(new Date());
//   const [showDatePicker, setShowDatePicker] = useState(false);
  
//   // Address selections
//   const [selectedDivision, setSelectedDivision] = useState(null);
//   const [selectedDistrict, setSelectedDistrict] = useState(null);
//   const [selectedThana, setSelectedThana] = useState(null);
  
//   // Available options based on selections
//   const [availableDistricts, setAvailableDistricts] = useState([]);
//   const [availableThanas, setAvailableThanas] = useState([]);
  
//   // Service Area state
//   const [serviceDivision, setServiceDivision] = useState(null);
//   const [serviceDistrict, setServiceDistrict] = useState(null);
//   const [serviceThanas, setServiceThanas] = useState([]);
//   const [availableServiceDistricts, setAvailableServiceDistricts] = useState([]);
//   const [availableServiceThanas, setAvailableServiceThanas] = useState([]);
  
//   // Document Upload state
//   const [cvFile, setCvFile] = useState(null);
//   const [tradeLicenseFile, setTradeLicenseFile] = useState(null);
  
//   const [loading, setLoading] = useState(false);
  
//   // Initialize form data from store
//   useEffect(() => {
//     if (!data) return;
//     setFormData({
//       name: data.name || '',
//       email: data.email || '',
//       phone: data.phone || '',
//       address: data.address || '',
//     });
//     if (data.dob) setDob(new Date(data.dob));
//     if (data.divisionKey) {
//       setSelectedDivision(data.divisionKey);
//       setAvailableDistricts(districts[data.divisionKey] || []);
//     }
//     if (data.districtKey) {
//       setSelectedDistrict(data.districtKey);
//       setAvailableThanas(thanas[data.districtKey] || []);
//     }
//     if (data.thanaKey) {
//       setSelectedThana(data.thanaKey);
//     }
    
//     // Initialize service area from store
//     if (data.serviceDivisionKey) {
//       setServiceDivision(data.serviceDivisionKey);
//       setAvailableServiceDistricts(districts[data.serviceDivisionKey] || []);
//     }
//     if (data.serviceDistrictKey) {
//       setServiceDistrict(data.serviceDistrictKey);
//       setAvailableServiceThanas(thanas[data.serviceDistrictKey] || []);
//     }
//     if (data.serviceThanas) {
//       setServiceThanas(data.serviceThanas);
//     }
    
//     // Initialize documents from store
//     if (data.cvFile) setCvFile(data.cvFile);
//     if (data.tradeLicenseFile) setTradeLicenseFile(data.tradeLicenseFile);
//   }, [data]);
  
//   // Division select handler
//   const handleDivisionSelect = (divisionKey) => {
//     const divisionObj = divisions.find(d => d.key === divisionKey) || { value: '' };
//     update({
//       divisionKey,
//       divisionValue: divisionObj.value,
//       districtKey: '',
//       districtValue: '',
//       thanaKey: '',
//       thanaValue: '',
//     });
//   };
  
//   // District select handler
//   const handleDistrictSelect = (districtKey) => {
//     const districtList = districts[data.divisionKey] || [];
//     const districtObj = districtList.find(d => d.key === districtKey) || { value: '' };
//     update({
//       districtKey,
//       districtValue: districtObj.value,
//       thanaKey: '',
//       thanaValue: '',
//     });
//   };
  
//   // Thana select handler
//   const handleThanaSelect = (thanaKey) => {
//     const thanaList = thanas[data.districtKey] || [];
//     const thanaObj = thanaList.find(t => t.key === thanaKey) || { value: '' };
//     update({
//       thanaKey,
//       thanaValue: thanaObj.value,
//     });
//   };
  
//   // Service Area Division select handler
//   const handleServiceDivisionSelect = (divisionKey) => {
//     const divisionObj = divisions.find(d => d.key === divisionKey) || { value: '' };
//     setServiceDivision(divisionKey);
//     setAvailableServiceDistricts(districts[divisionKey] || []);
//     setServiceDistrict(null);
//     setServiceThanas([]);
//     update({
//       serviceDivisionKey: divisionKey,
//       serviceDivisionValue: divisionObj.value,
//       serviceDistrictKey: '',
//       serviceDistrictValue: '',
//       serviceThanas: [],
//     });
//   };
  
//   // Service Area District select handler
//   const handleServiceDistrictSelect = (districtKey) => {
//     const districtList = districts[serviceDivision] || [];
//     const districtObj = districtList.find(d => d.key === districtKey) || { value: '' };
//     setServiceDistrict(districtKey);
//     setAvailableServiceThanas(thanas[districtKey] || []);
//     setServiceThanas([]);
//     update({
//       serviceDistrictKey: districtKey,
//       serviceDistrictValue: districtObj.value,
//       serviceThanas: [],
//     });
//   };
  
//   // Service Area Thana select handler
//   const handleServiceThanaSelect = (thanaKey) => {
//     const thanaList = thanas[serviceDistrict] || [];
//     const thanaObj = thanaList.find(t => t.key === thanaKey) || { value: '' };
    
//     // Check if thana is already selected
//     if (!serviceThanas.some(t => t.key === thanaKey)) {
//       const updatedThanas = [...serviceThanas, { key: thanaKey, value: thanaObj.value }];
//       setServiceThanas(updatedThanas);
//       update({ serviceThanas: updatedThanas });
//     }
//   };
  
//   // Remove selected thana from service area
//   const handleRemoveServiceThana = (thanaKey) => {
//     const updatedThanas = serviceThanas.filter(t => t.key !== thanaKey);
//     setServiceThanas(updatedThanas);
//     update({ serviceThanas: updatedThanas });
//   };
  
//   // CV/Resume Picker
// const handlePickCv = async () => {
//   try {
//     console.log("Starting CV document picker...");
//     const result = await DocumentPicker.getDocumentAsync({
//       type: 'application/pdf',
//       copyToCacheDirectory: true,
//     });

//     console.log("Document picker result:", result);

//     if (!result.canceled && result.assets?.length > 0) {
//       const asset = result.assets[0];
//       const file = {
//         name: asset.name,
//         uri: asset.uri,
//         type: asset.mimeType || 'application/pdf',
//         size: asset.size
//       };
//       console.log("Selected CV file:", file);
//       setCvFile(file);
//       update({ cvFile: file });
//       Alert.alert('Success', 'CV/Resume uploaded successfully');
//     } else {
//       console.log("User cancelled document picker");
//     }
//   } catch (err) {
//     console.error('DocumentPicker Error: ', err);
//     Alert.alert('Error', 'Failed to pick CV/Resume: ' + err.message);
//   }
// };

// // Trade License Picker
// const handlePickTradeLicense = async () => {
//   try {
//     console.log("Starting Trade License document picker...");
//     const result = await DocumentPicker.getDocumentAsync({
//       type: 'application/pdf',
//       copyToCacheDirectory: true,
//     });

//     console.log("Document picker result:", result);

//     if (!result.canceled && result.assets?.length > 0) {
//       const asset = result.assets[0];
//       const file = {
//         name: asset.name,
//         uri: asset.uri,
//         type: asset.mimeType || 'application/pdf',
//         size: asset.size
//       };
//       console.log("Selected Trade License file:", file);
//       setTradeLicenseFile(file);
//       update({ tradeLicenseFile: file });
//       Alert.alert('Success', 'Trade License uploaded successfully');
//     } else {
//       console.log("User cancelled document picker");
//     }
//   } catch (err) {
//     console.error('DocumentPicker Error: ', err);
//     Alert.alert('Error', 'Failed to pick Trade License: ' + err.message);
//   }
// };

//   const handleInputChange = useCallback((field, value) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//   }, []);
  
//   const onChangeDate = useCallback((event, selectedDate) => {
//     if (event.type === 'set') {
//       setDob(selectedDate || dob);
//       if (Platform.OS === 'android') setShowDatePicker(false);
//     } else {
//       setShowDatePicker(false);
//     }
//   }, [dob]);
  
//   const validate = useCallback(() => {
//     if (!formData.name || formData.name.length < 3) {
//       Alert.alert('Invalid Name', 'Name must be at least 3 characters');
//       return false;
//     }
//     if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
//       Alert.alert('Invalid Email', 'Please enter a valid email address');
//       return false;
//     }
//     if (!/^(?:\+88|01)?\d{11}$/.test(formData.phone)) {
//       Alert.alert('Invalid Phone', 'Please enter a valid Bangladeshi phone number');
//       return false;
//     }
//     const age = new Date().getFullYear() - dob.getFullYear();
//     if (age < 18) {
//       Alert.alert('Age Restriction', 'You must be at least 18 years old');
//       return false;
//     }
//     if (!formData.address || !selectedDivision || !selectedDistrict || !selectedThana) {
//       Alert.alert('Missing Information', 'Please fill all address fields');
//       return false;
//     }
//     if (!serviceDivision || !serviceDistrict || serviceThanas.length === 0) {
//       Alert.alert('Missing Information', 'Please select at least one service area');
//       return false;
//     }
//     if (!cvFile) {
//       Alert.alert('Missing Document', 'Please upload your CV/Resume');
//       return false;
//     }
//     if (!tradeLicenseFile) {
//       Alert.alert('Missing Document', 'Please upload your Trade License');
//       return false;
//     }
//     return true;
//   }, [formData, dob, selectedDivision, selectedDistrict, selectedThana, 
//       serviceDivision, serviceDistrict, serviceThanas, cvFile, tradeLicenseFile]);
  
//   const handleNext = useCallback(async () => {
//     if (!validate()) return;
//     setLoading(true);
//     try {
//       const payload = {
//         ...formData,
//         dob: dob.toISOString(),
//         divisionKey: selectedDivision,
//         districtKey: selectedDistrict,
//         thanaKey: selectedThana,
//         serviceDivisionKey: serviceDivision,
//         serviceDistrictKey: serviceDistrict,
//         serviceThanas: serviceThanas,
//         cvFile: cvFile,
//         tradeLicenseFile: tradeLicenseFile,
//       };
//       await update(payload);
//       router.push('/auth/register/RegisterStep2');
//     } catch (error) {
//       Alert.alert('Error', 'Failed to proceed to next step');
//       console.error('Registration Error:', error);
//     } finally {
//       setLoading(false);
//     }
//   }, [formData, dob, selectedDivision, selectedDistrict, selectedThana, 
//       serviceDivision, serviceDistrict, serviceThanas, cvFile, tradeLicenseFile, validate, update]);
  
//   return (
//     <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
//       <ScrollView className="flex-1 p-4 bg-white" contentContainerStyle={{ paddingBottom: 20 }}>
//         <Text className="text-2xl font-bold mb-8 mt-5">Personal Information</Text>
        
//         {/* Personal Information Fields */}
//         <TextInput
//           placeholder="Full Name"
//           placeholderTextColor="#999"
//           value={formData.name}
//           onChangeText={(text) => handleInputChange('name', text)}
//           className="border border-gray-300 p-3 mb-4 rounded text-black"
//         />
//         <TextInput
//           placeholder="Email"
//           placeholderTextColor="#999"
//           value={formData.email}
//           onChangeText={(text) => handleInputChange('email', text)}
//           keyboardType="email-address"
//           autoCapitalize="none"
//           className="border border-gray-300 p-3 mb-4 rounded text-black"
//         />
//         <TextInput
//           placeholder="Phone Number"
//           placeholderTextColor="#999"
//           value={formData.phone}
//           onChangeText={(text) => handleInputChange('phone', text)}
//           keyboardType="phone-pad"
//           className="border border-gray-300 p-3 mb-4 rounded text-black"
//         />
//         <TouchableOpacity onPress={() => setShowDatePicker(true)} className="border border-gray-300 p-3 mb-4 rounded justify-center">
//           <Text>{dob.toDateString()}</Text>
//         </TouchableOpacity>
//         {showDatePicker && (
//           <DateTimePicker
//             value={dob}
//             mode="date"
//             display={Platform.OS === 'ios' ? 'spinner' : 'default'}
//             onChange={onChangeDate}
//             maximumDate={new Date()}
//           />
//         )}
        
//         {/* Address Information Section */}
//         <Text className="text-lg font-semibold mt-6 mb-4">Address Information</Text>
//         <TextInput
//           placeholder="Full Address (House/Road No)"
//           placeholderTextColor="#999"
//           value={formData.address}
//           onChangeText={(text) => handleInputChange('address', text)}
//           multiline
//           numberOfLines={3}
//           className="border border-gray-300 p-3 mb-4 rounded text-black h-20 text-base"
//         />
//         <AddressDropdown
//           label="Division"
//           data={divisions}
//           onSelect={handleDivisionSelect}
//           placeholder="Select Division"
//           defaultOption={selectedDivision}
//         />
//         <AddressDropdown
//           label="District"
//           data={availableDistricts}
//           onSelect={handleDistrictSelect}
//           placeholder={selectedDivision ? 'Select District' : 'First select Division'}
//           disabled={!selectedDivision}
//           defaultOption={selectedDistrict}
//         />
//         <AddressDropdown
//           label="Thana/Police Station"
//           data={availableThanas}
//           onSelect={handleThanaSelect}
//           placeholder={selectedDistrict ? 'Select Thana' : 'First select District'}
//           disabled={!selectedDistrict}
//           defaultOption={selectedThana}
//         />
        
//         {/* Service Area Section */}
//         <Text className="text-lg font-semibold mt-8 mb-4">Service Area</Text>
//         <AddressDropdown
//           label="Division"
//           data={divisions}
//           onSelect={handleServiceDivisionSelect}
//           placeholder="Select Division"
//           defaultOption={serviceDivision}
//         />
//         <AddressDropdown
//           label="District"
//           data={availableServiceDistricts}
//           onSelect={handleServiceDistrictSelect}
//           placeholder={serviceDivision ? 'Select District' : 'First select Division'}
//           disabled={!serviceDivision}
//           defaultOption={serviceDistrict}
//         />
        
//         {/* Thana Multi-Select */}
//         <Text className="text-base font-medium mb-2">Thana/Police Station</Text>
//         <AddressDropdown
//           label=""
//           data={availableServiceThanas}
//           onSelect={handleServiceThanaSelect}
//           placeholder={serviceDistrict ? 'Select Thana' : 'First select District'}
//           disabled={!serviceDistrict}
//         />
        
//         {/* Selected Thanas Display */}
//         {serviceThanas.length > 0 && (
//           <View className="flex-row flex-wrap mt-2">
//             {serviceThanas.map((thana) => (
//               <View key={thana.key} className="flex-row items-center bg-blue-100 rounded-full px-3 py-1 mr-2 mb-2">
//                 <Text className="text-blue-800">{thana.value}</Text>
//                 <TouchableOpacity onPress={() => handleRemoveServiceThana(thana.key)} className="ml-2">
//                   <Text className="text-red-500 font-bold">×</Text>
//                 </TouchableOpacity>
//               </View>
//             ))}
//           </View>
//         )}
        
//         {/* Document Upload Section */}
//         <Text className="text-lg font-semibold mt-8 mb-4">Document Upload</Text>
        
//         {/* CV/Resume Upload */}
//         <Text className="text-base font-medium mb-2">CV/Resume (PDF)</Text>
//         <TouchableOpacity 
//           onPress={handlePickCv}
//           className="border border-gray-300 p-3 mb-4 rounded justify-center flex-row items-center"
//         >
//           <Text className="text-gray-700 flex-1">
//             {cvFile ? cvFile.name : 'Select CV/Resume'}
//           </Text>
//           <Text className="text-blue-500 font-medium">Browse</Text>
//         </TouchableOpacity>
        
//         {/* Trade License Upload */}
//         <Text className="text-base font-medium mb-2">Trade License (PDF)</Text>
//         <TouchableOpacity 
//           onPress={handlePickTradeLicense}
//           className="border border-gray-300 p-3 mb-4 rounded justify-center flex-row items-center"
//         >
//           <Text className="text-gray-700 flex-1">
//             {tradeLicenseFile ? tradeLicenseFile.name : 'Select Trade License'}
//           </Text>
//           <Text className="text-blue-500 font-medium">Browse</Text>
//         </TouchableOpacity>
        
//         <Button
//           title={loading ? 'Submitting...' : 'Next'}
//           onPress={handleNext}
//           disabled={loading}
//           className="mt-6"
//         />
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// }

// export default RegisterStep1;

// import DateTimePicker from '@react-native-community/datetimepicker';
// import { router } from 'expo-router';
// import { useEffect, useState, useCallback } from 'react';
// import {
//   Alert,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import { AddressDropdown } from '../../../components/ui/AddressDropdown';
// import Button from '../../../components/ui/Button';
// import { districts, divisions, thanas } from '../../../utils/addressData';
// import { useVendorData } from '../../../store/useVendorStore';
// import * as DocumentPicker from 'expo-document-picker';
// import servicesData from '../../../utils/services.json'; 

// // Define Olympic blue as primary color
// const PRIMARY_COLOR = '#0085C7';
// const LIGHT_BLUE = '#E6F2F8';
// const BORDER_COLOR = '#D1E7F5';

// function RegisterStep1() {
//   //direct state access
//   const data = useVendorData(state => state.data);
//   const update = useVendorData(state => state.update);
  
//   // Form data state
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     address: '',
//   });
  
//   // Date of birth
//   const [dob, setDob] = useState(new Date());
//   const [showDatePicker, setShowDatePicker] = useState(false);
  
//   // Address selections
//   const [selectedDivision, setSelectedDivision] = useState(null);
//   const [selectedDistrict, setSelectedDistrict] = useState(null);
//   const [selectedThana, setSelectedThana] = useState(null);
  
//   // Available options based on selections
//   const [availableDistricts, setAvailableDistricts] = useState([]);
//   const [availableThanas, setAvailableThanas] = useState([]);
  
//   // Service Area state
//   const [serviceDivision, setServiceDivision] = useState(null);
//   const [serviceDistrict, setServiceDistrict] = useState(null);
//   const [serviceThanas, setServiceThanas] = useState([]);
//   const [availableServiceDistricts, setAvailableServiceDistricts] = useState([]);
//   const [availableServiceThanas, setAvailableServiceThanas] = useState([]);
  
//   // Document Upload state
//   const [cvFile, setCvFile] = useState(null);
//   const [tradeLicenseFile, setTradeLicenseFile] = useState(null);
  
//   // Business Information state
//   const [businessName, setBusinessName] = useState('');
//   const [businessDescription, setBusinessDescription] = useState('');
  
//   // Present Address state
//   const [presentAddress, setPresentAddress] = useState('');
//   const [presentDivision, setPresentDivision] = useState(null);
//   const [presentDistrict, setPresentDistrict] = useState(null);
//   const [presentThana, setPresentThana] = useState(null);
//   const [availablePresentDistricts, setAvailablePresentDistricts] = useState([]);
//   const [availablePresentThanas, setAvailablePresentThanas] = useState([]);
  
//   // Permanent Address state
//   const [permanentAddress, setPermanentAddress] = useState('');
//   const [permanentDivision, setPermanentDivision] = useState(null);
//   const [permanentDistrict, setPermanentDistrict] = useState(null);
//   const [permanentThana, setPermanentThana] = useState(null);
//   const [availablePermanentDistricts, setAvailablePermanentDistricts] = useState([]);
//   const [availablePermanentThanas, setAvailablePermanentThanas] = useState([]);
  
//  // Provided Services state
//   const [providedServices, setProvidedServices] = useState([]);
  
//   const [loading, setLoading] = useState(false);
  
//   // Initialize form data from store
//   useEffect(() => {
//     if (!data) return;
//     setFormData({
//       name: data.name || '',
//       email: data.email || '',
//       phone: data.phone || '',
//       address: data.address || '',
//     });
//     if (data.dob) setDob(new Date(data.dob));
//     if (data.divisionKey) {
//       setSelectedDivision(data.divisionKey);
//       setAvailableDistricts(districts[data.divisionKey] || []);
//     }
//     if (data.districtKey) {
//       setSelectedDistrict(data.districtKey);
//       setAvailableThanas(thanas[data.districtKey] || []);
//     }
//     if (data.thanaKey) {
//       setSelectedThana(data.thanaKey);
//     }
    
//     // Initialize service area from store
//     if (data.serviceDivisionKey) {
//       setServiceDivision(data.serviceDivisionKey);
//       setAvailableServiceDistricts(districts[data.serviceDivisionKey] || []);
//     }
//     if (data.serviceDistrictKey) {
//       setServiceDistrict(data.serviceDistrictKey);
//       setAvailableServiceThanas(thanas[data.serviceDistrictKey] || []);
//     }
//     if (data.serviceThanas) {
//       setServiceThanas(data.serviceThanas);
//     }
    
//     // Initialize documents from store
//     if (data.cvFile) setCvFile(data.cvFile);
//     if (data.tradeLicenseFile) setTradeLicenseFile(data.tradeLicenseFile);
    
//     // Initialize business information from store
//     setBusinessName(data.businessName || '');
//     setBusinessDescription(data.businessDescription || '');
    
//     // Initialize present address from store
//     setPresentAddress(data.presentAddress || '');
//     if (data.presentDivisionKey) {
//       setPresentDivision(data.presentDivisionKey);
//       setAvailablePresentDistricts(districts[data.presentDivisionKey] || []);
//     }
//     if (data.presentDistrictKey) {
//       setPresentDistrict(data.presentDistrictKey);
//       setAvailablePresentThanas(thanas[data.presentDistrictKey] || []);
//     }
//     if (data.presentThanaKey) {
//       setPresentThana(data.presentThanaKey);
//     }
    
//     // Initialize permanent address from store
//     setPermanentAddress(data.permanentAddress || '');
//     if (data.permanentDivisionKey) {
//       setPermanentDivision(data.permanentDivisionKey);
//       setAvailablePermanentDistricts(districts[data.permanentDivisionKey] || []);
//     }
//     if (data.permanentDistrictKey) {
//       setPermanentDistrict(data.permanentDistrictKey);
//       setAvailablePermanentThanas(thanas[data.permanentDistrictKey] || []);
//     }
//     if (data.permanentThanaKey) {
//       setPermanentThana(data.permanentThanaKey);
//     }
    
//     // Initialize provided services from store
//     if (data.providedServices) {
//       setProvidedServices(data.providedServices);
//     }
//   }, [data]);
  
//   // Division select handler
//   const handleDivisionSelect = (divisionKey) => {
//     const divisionObj = divisions.find(d => d.key === divisionKey) || { value: '' };
//     update({
//       divisionKey,
//       divisionValue: divisionObj.value,
//       districtKey: '',
//       districtValue: '',
//       thanaKey: '',
//       thanaValue: '',
//     });
//   };
  
//   // District select handler
//   const handleDistrictSelect = (districtKey) => {
//     const districtList = districts[data.divisionKey] || [];
//     const districtObj = districtList.find(d => d.key === districtKey) || { value: '' };
//     update({
//       districtKey,
//       districtValue: districtObj.value,
//       thanaKey: '',
//       thanaValue: '',
//     });
//   };
  
//   // Thana select handler
//   const handleThanaSelect = (thanaKey) => {
//     const thanaList = thanas[data.districtKey] || [];
//     const thanaObj = thanaList.find(t => t.key === thanaKey) || { value: '' };
//     update({
//       thanaKey,
//       thanaValue: thanaObj.value,
//     });
//   };
  
//   // Service Area Division select handler
//   const handleServiceDivisionSelect = (divisionKey) => {
//     const divisionObj = divisions.find(d => d.key === divisionKey) || { value: '' };
//     setServiceDivision(divisionKey);
//     setAvailableServiceDistricts(districts[divisionKey] || []);
//     setServiceDistrict(null);
//     setServiceThanas([]);
//     update({
//       serviceDivisionKey: divisionKey,
//       serviceDivisionValue: divisionObj.value,
//       serviceDistrictKey: '',
//       serviceDistrictValue: '',
//       serviceThanas: [],
//     });
//   };
  
//   // Service Area District select handler
//   const handleServiceDistrictSelect = (districtKey) => {
//     const districtList = districts[serviceDivision] || [];
//     const districtObj = districtList.find(d => d.key === districtKey) || { value: '' };
//     setServiceDistrict(districtKey);
//     setAvailableServiceThanas(thanas[districtKey] || []);
//     setServiceThanas([]);
//     update({
//       serviceDistrictKey: districtKey,
//       serviceDistrictValue: districtObj.value,
//       serviceThanas: [],
//     });
//   };
  
//   // Service Area Thana select handler
//   const handleServiceThanaSelect = (thanaKey) => {
//     const thanaList = thanas[serviceDistrict] || [];
//     const thanaObj = thanaList.find(t => t.key === thanaKey) || { value: '' };
    
//     // Check if thana is already selected
//     if (!serviceThanas.some(t => t.key === thanaKey)) {
//       const updatedThanas = [...serviceThanas, { key: thanaKey, value: thanaObj.value }];
//       setServiceThanas(updatedThanas);
//       update({ serviceThanas: updatedThanas });
//     }
//   };
  
//   // Remove selected thana from service area
//   const handleRemoveServiceThana = (thanaKey) => {
//     const updatedThanas = serviceThanas.filter(t => t.key !== thanaKey);
//     setServiceThanas(updatedThanas);
//     update({ serviceThanas: updatedThanas });
//   };
  
//   // Business Information handlers
//   const handleBusinessNameChange = useCallback((text) => {
//     setBusinessName(text);
//     update({ businessName: text });
//   }, []);
  
//   const handleBusinessDescriptionChange = useCallback((text) => {
//     setBusinessDescription(text);
//     update({ businessDescription: text });
//   }, []);
  
//   // Present Address handlers
//   const handlePresentDivisionSelect = (divisionKey) => {
//     const divisionObj = divisions.find(d => d.key === divisionKey) || { value: '' };
//     setPresentDivision(divisionKey);
//     setAvailablePresentDistricts(districts[divisionKey] || []);
//     setPresentDistrict(null);
//     setPresentThana(null);
//     update({
//       presentDivisionKey: divisionKey,
//       presentDivisionValue: divisionObj.value,
//       presentDistrictKey: '',
//       presentDistrictValue: '',
//       presentThanaKey: '',
//       presentThanaValue: '',
//     });
//   };
  
//   const handlePresentDistrictSelect = (districtKey) => {
//     const districtList = districts[presentDivision] || [];
//     const districtObj = districtList.find(d => d.key === districtKey) || { value: '' };
//     setPresentDistrict(districtKey);
//     setAvailablePresentThanas(thanas[districtKey] || []);
//     setPresentThana(null);
//     update({
//       presentDistrictKey: districtKey,
//       presentDistrictValue: districtObj.value,
//       presentThanaKey: '',
//       presentThanaValue: '',
//     });
//   };
  
//   const handlePresentThanaSelect = (thanaKey) => {
//     const thanaList = thanas[presentDistrict] || [];
//     const thanaObj = thanaList.find(t => t.key === thanaKey) || { value: '' };
//     setPresentThana(thanaKey);
//     update({
//       presentThanaKey: thanaKey,
//       presentThanaValue: thanaObj.value,
//     });
//   };
  
//   // Permanent Address handlers
//   const handlePermanentDivisionSelect = (divisionKey) => {
//     const divisionObj = divisions.find(d => d.key === divisionKey) || { value: '' };
//     setPermanentDivision(divisionKey);
//     setAvailablePermanentDistricts(districts[divisionKey] || []);
//     setPermanentDistrict(null);
//     setPermanentThana(null);
//     update({
//       permanentDivisionKey: divisionKey,
//       permanentDivisionValue: divisionObj.value,
//       permanentDistrictKey: '',
//       permanentDistrictValue: '',
//       permanentThanaKey: '',
//       permanentThanaValue: '',
//     });
//   };
  
//   const handlePermanentDistrictSelect = (districtKey) => {
//     const districtList = districts[permanentDivision] || [];
//     const districtObj = districtList.find(d => d.key === districtKey) || { value: '' };
//     setPermanentDistrict(districtKey);
//     setAvailablePermanentThanas(thanas[districtKey] || []);
//     setPermanentThana(null);
//     update({
//       permanentDistrictKey: districtKey,
//       permanentDistrictValue: districtObj.value,
//       permanentThanaKey: '',
//       permanentThanaValue: '',
//     });
//   };
  
//   const handlePermanentThanaSelect = (thanaKey) => {
//     const thanaList = thanas[permanentDistrict] || [];
//     const thanaObj = thanaList.find(t => t.key === thanaKey) || { value: '' };
//     setPermanentThana(thanaKey);
//     update({
//       permanentThanaKey: thanaKey,
//       permanentThanaValue: thanaObj.value,
//     });
//   };
  
//   // Provided Services handlers
//   const handleServiceSelect = (serviceKey) => {
//     const serviceObj = servicesData.find(s => s.key === serviceKey) || { value: '' };
    
//     // Check if service is already selected
//     if (!providedServices.some(s => s.key === serviceKey)) {
//       const updatedServices = [...providedServices, { key: serviceKey, value: serviceObj.value }];
//       setProvidedServices(updatedServices);
//       update({ providedServices: updatedServices });
//     }
//   };
  
//   const handleRemoveService = (serviceKey) => {
//     const updatedServices = providedServices.filter(s => s.key !== serviceKey);
//     setProvidedServices(updatedServices);
//     update({ providedServices: updatedServices });
//   };
  
//   // CV/Resume Picker
//   const handlePickCv = async () => {
//     try {
//       console.log("Starting CV document picker...");
//       const result = await DocumentPicker.getDocumentAsync({
//         type: 'application/pdf',
//         copyToCacheDirectory: true,
//       });
//       console.log("Document picker result:", result);
//       if (!result.canceled && result.assets?.length > 0) {
//         const asset = result.assets[0];
//         const file = {
//           name: asset.name,
//           uri: asset.uri,
//           type: asset.mimeType || 'application/pdf',
//           size: asset.size
//         };
//         console.log("Selected CV file:", file);
//         setCvFile(file);
//         update({ cvFile: file });
//         Alert.alert('Success', 'CV/Resume uploaded successfully');
//       } else {
//         console.log("User cancelled document picker");
//       }
//     } catch (err) {
//       console.error('DocumentPicker Error: ', err);
//       Alert.alert('Error', 'Failed to pick CV/Resume: ' + err.message);
//     }
//   };
  
//   // Trade License Picker
//   const handlePickTradeLicense = async () => {
//     try {
//       console.log("Starting Trade License document picker...");
//       const result = await DocumentPicker.getDocumentAsync({
//         type: 'application/pdf',
//         copyToCacheDirectory: true,
//       });
//       console.log("Document picker result:", result);
//       if (!result.canceled && result.assets?.length > 0) {
//         const asset = result.assets[0];
//         const file = {
//           name: asset.name,
//           uri: asset.uri,
//           type: asset.mimeType || 'application/pdf',
//           size: asset.size
//         };
//         console.log("Selected Trade License file:", file);
//         setTradeLicenseFile(file);
//         update({ tradeLicenseFile: file });
//         Alert.alert('Success', 'Trade License uploaded successfully');
//       } else {
//         console.log("User cancelled document picker");
//       }
//     } catch (err) {
//       console.error('DocumentPicker Error: ', err);
//       Alert.alert('Error', 'Failed to pick Trade License: ' + err.message);
//     }
//   };
  
//   const handleInputChange = useCallback((field, value) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//   }, []);
  
//   const onChangeDate = useCallback((event, selectedDate) => {
//     if (event.type === 'set') {
//       setDob(selectedDate || dob);
//       if (Platform.OS === 'android') setShowDatePicker(false);
//     } else {
//       setShowDatePicker(false);
//     }
//   }, [dob]);
  
//   const validate = useCallback(() => {
//     if (!formData.name || formData.name.length < 3) {
//       Alert.alert('Invalid Name', 'Name must be at least 3 characters');
//       return false;
//     }
//     if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
//       Alert.alert('Invalid Email', 'Please enter a valid email address');
//       return false;
//     }
//     if (!/^(?:\+88|01)?\d{11}$/.test(formData.phone)) {
//       Alert.alert('Invalid Phone', 'Please enter a valid Bangladeshi phone number');
//       return false;
//     }
//     const age = new Date().getFullYear() - dob.getFullYear();
//     if (age < 18) {
//       Alert.alert('Age Restriction', 'You must be at least 18 years old');
//       return false;
//     }
//     if (!formData.address || !selectedDivision || !selectedDistrict || !selectedThana) {
//       Alert.alert('Missing Information', 'Please fill all business address fields');
//       return false;
//     }
//     if (!serviceDivision || !serviceDistrict || serviceThanas.length === 0) {
//       Alert.alert('Missing Information', 'Please select at least one service area');
//       return false;
//     }
//     if (!businessName || businessName.length < 3) {
//       Alert.alert('Invalid Business Name', 'Business name must be at least 3 characters');
//       return false;
//     }
//     if (!presentAddress || !presentDivision || !presentDistrict || !presentThana) {
//       Alert.alert('Missing Information', 'Please fill all present address fields');
//       return false;
//     }
//     if (!permanentAddress || !permanentDivision || !permanentDistrict || !permanentThana) {
//       Alert.alert('Missing Information', 'Please fill all permanent address fields');
//       return false;
//     }
//     if (providedServices.length === 0) {
//       Alert.alert('Missing Information', 'Please select at least one provided service');
//       return false;
//     }
//     if (!cvFile) {
//       Alert.alert('Missing Document', 'Please upload your CV/Resume');
//       return false;
//     }
//     if (!tradeLicenseFile) {
//       Alert.alert('Missing Document', 'Please upload your Trade License');
//       return false;
//     }
//     return true;
//   }, [formData, dob, selectedDivision, selectedDistrict, selectedThana, 
//       serviceDivision, serviceDistrict, serviceThanas, businessName, 
//       presentAddress, presentDivision, presentDistrict, presentThana,
//       permanentAddress, permanentDivision, permanentDistrict, permanentThana,
//       providedServices, cvFile, tradeLicenseFile]);
  
//   const handleNext = useCallback(async () => {
//     if (!validate()) return;
//     setLoading(true);
//     try {
//       const payload = {
//         ...formData,
//         dob: dob.toISOString(),
//         divisionKey: selectedDivision,
//         districtKey: selectedDistrict,
//         thanaKey: selectedThana,
//         serviceDivisionKey: serviceDivision,
//         serviceDistrictKey: serviceDistrict,
//         serviceThanas: serviceThanas,
//         businessName,
//         businessDescription,
//         presentAddress,
//         presentDivisionKey: presentDivision,
//         presentDistrictKey: presentDistrict,
//         presentThanaKey: presentThana,
//         permanentAddress,
//         permanentDivisionKey: permanentDivision,
//         permanentDistrictKey: permanentDistrict,
//         permanentThanaKey: permanentThana,
//         providedServices,
//         cvFile: cvFile,
//         tradeLicenseFile: tradeLicenseFile,
//       };
//       await update(payload);
//       router.push('/auth/register/RegisterStep2');
//     } catch (error) {
//       Alert.alert('Error', 'Failed to proceed to next step');
//       console.error('Registration Error:', error);
//     } finally {
//       setLoading(false);
//     }
//   }, [formData, dob, selectedDivision, selectedDistrict, selectedThana, 
//       serviceDivision, serviceDistrict, serviceThanas, businessName, 
//       presentAddress, presentDivision, presentDistrict, presentThana,
//       permanentAddress, permanentDivision, permanentDistrict, permanentThana,
//       providedServices, cvFile, tradeLicenseFile, validate, update]);
  
//   return (
//     <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-gray-50">
//       <ScrollView className="flex-1 p-4 bg-gray-50" contentContainerStyle={{ paddingBottom: 20 }}>
//         <Text className="text-3xl font-bold mb-8 mt-5 text-center" style={{ color: PRIMARY_COLOR }}>Vendor Registration</Text>
        
//         {/* Personal Information Section */}
//         <View className="bg-white rounded-xl shadow-md p-5 mb-6">
//           <View className="flex-row items-center mb-4">
//             <View className="w-8 h-8 rounded-full items-center justify-center mr-3" style={{ backgroundColor: LIGHT_BLUE }}>
//               <Text className="font-bold" style={{ color: PRIMARY_COLOR }}>1</Text>
//             </View>
//             <Text className="text-xl font-bold" style={{ color: PRIMARY_COLOR }}>Personal Information</Text>
//           </View>
          
//           <TextInput
//             placeholder="Full Name"
//             placeholderTextColor="#999"
//             value={formData.name}
//             onChangeText={(text) => handleInputChange('name', text)}
//             className="border border-gray-300 p-3 mb-4 rounded-lg text-black"
//           />
//           <TextInput
//             placeholder="Email"
//             placeholderTextColor="#999"
//             value={formData.email}
//             onChangeText={(text) => handleInputChange('email', text)}
//             keyboardType="email-address"
//             autoCapitalize="none"
//             className="border border-gray-300 p-3 mb-4 rounded-lg text-black"
//           />
//           <TextInput
//             placeholder="Phone Number"
//             placeholderTextColor="#999"
//             value={formData.phone}
//             onChangeText={(text) => handleInputChange('phone', text)}
//             keyboardType="phone-pad"
//             className="border border-gray-300 p-3 mb-4 rounded-lg text-black"
//           />
//           <TouchableOpacity 
//             onPress={() => setShowDatePicker(true)} 
//             className="border border-gray-300 p-3 mb-4 rounded-lg justify-center"
//           >
//             <Text className="text-black">{dob.toDateString()}</Text>
//           </TouchableOpacity>
//           {showDatePicker && (
//             <DateTimePicker
//               value={dob}
//               mode="date"
//               display={Platform.OS === 'ios' ? 'spinner' : 'default'}
//               onChange={onChangeDate}
//               maximumDate={new Date()}
//             />
//           )}
//         </View>
        
//         {/* Business Information Section */}
//         <View className="bg-white rounded-xl shadow-md p-5 mb-6">
//           <View className="flex-row items-center mb-4">
//             <View className="w-8 h-8 rounded-full items-center justify-center mr-3" style={{ backgroundColor: LIGHT_BLUE }}>
//               <Text className="font-bold" style={{ color: PRIMARY_COLOR }}>2</Text>
//             </View>
//             <Text className="text-xl font-bold" style={{ color: PRIMARY_COLOR }}>Business Information</Text>
//           </View>
          
//           <TextInput
//             placeholder="Business Name"
//             placeholderTextColor="#999"
//             value={businessName}
//             onChangeText={handleBusinessNameChange}
//             className="border border-gray-300 p-3 mb-4 rounded-lg text-black"
//           />
          
//           <TextInput
//             placeholder="Business Description"
//             placeholderTextColor="#999"
//             value={businessDescription}
//             onChangeText={handleBusinessDescriptionChange}
//             multiline
//             numberOfLines={3}
//             className="border border-gray-300 p-3 mb-4 rounded-lg text-black h-20 text-base"
//           />
          
//           {/* Business Address Information Section */}
//           <Text className="text-lg font-semibold mt-2 mb-4" style={{ color: PRIMARY_COLOR }}>Business Address</Text>
//           <TextInput
//             placeholder="Full Address (House/Road No)"
//             placeholderTextColor="#999"
//             value={formData.address}
//             onChangeText={(text) => handleInputChange('address', text)}
//             multiline
//             numberOfLines={3}
//             className="border border-gray-300 p-3 mb-4 rounded-lg text-black h-20 text-base"
//           />
//           <AddressDropdown
//             label="Division"
//             data={divisions}
//             onSelect={handleDivisionSelect}
//             placeholder="Select Division"
//             defaultOption={selectedDivision}
//           />
//           <AddressDropdown
//             label="District"
//             data={availableDistricts}
//             onSelect={handleDistrictSelect}
//             placeholder={selectedDivision ? 'Select District' : 'First select Division'}
//             disabled={!selectedDivision}
//             defaultOption={selectedDistrict}
//           />
//           <AddressDropdown
//             label="Thana/Police Station"
//             data={availableThanas}
//             onSelect={handleThanaSelect}
//             placeholder={selectedDistrict ? 'Select Thana' : 'First select District'}
//             disabled={!selectedDistrict}
//             defaultOption={selectedThana}
//           />
//         </View>
        
//         {/* Provided Services Section */}
//         <View className="bg-white rounded-xl shadow-md p-5 mb-6">
//           <View className="flex-row items-center mb-4">
//             <View className="w-8 h-8 rounded-full items-center justify-center mr-3" style={{ backgroundColor: LIGHT_BLUE }}>
//               <Text className="font-bold" style={{ color: PRIMARY_COLOR }}>3</Text>
//             </View>
//             <Text className="text-xl font-bold" style={{ color: PRIMARY_COLOR }}>Services</Text>
//           </View>
          
//           <Text className="text-base font-medium mb-2">Provided Services</Text>
          
//           {/* Service Dropdown */}
//           <AddressDropdown
//             label=""
//             data={servicesData}
//             onSelect={handleServiceSelect}
//             placeholder="Select a service"
//           />
          
//           {/* Selected Services Display */}
//           {providedServices.length > 0 && (
//             <View className="flex-row flex-wrap mt-2">
//               {providedServices.map((service) => (
//                 <View key={service.key} className="flex-row items-center rounded-full px-3 py-1 mr-2 mb-2" style={{ backgroundColor: LIGHT_BLUE }}>
//                   <Text style={{ color: PRIMARY_COLOR }}>{service.value}</Text>
//                   <TouchableOpacity onPress={() => handleRemoveService(service.key)} className="ml-2">
//                     <Text className="text-red-500 font-bold">×</Text>
//                   </TouchableOpacity>
//                 </View>
//               ))}
//             </View>
//           )}
          
//           {/* Service Area Section */}
//           <Text className="text-lg font-semibold mt-6 mb-4" style={{ color: PRIMARY_COLOR }}>Service Area</Text>
//           <AddressDropdown
//             label="Division"
//             data={divisions}
//             onSelect={handleServiceDivisionSelect}
//             placeholder="Select Division"
//             defaultOption={serviceDivision}
//           />
//           <AddressDropdown
//             label="District"
//             data={availableServiceDistricts}
//             onSelect={handleServiceDistrictSelect}
//             placeholder={serviceDivision ? 'Select District' : 'First select Division'}
//             disabled={!serviceDivision}
//             defaultOption={serviceDistrict}
//           />
          
//           {/* Thana Multi-Select */}
//           <Text className="text-base font-medium mb-2">Thana/Police Station</Text>
//           <AddressDropdown
//             label=""
//             data={availableServiceThanas}
//             onSelect={handleServiceThanaSelect}
//             placeholder={serviceDistrict ? 'Select Thana' : 'First select District'}
//             disabled={!serviceDistrict}
//           />
          
//           {/* Selected Thanas Display */}
//           {serviceThanas.length > 0 && (
//             <View className="flex-row flex-wrap mt-2">
//               {serviceThanas.map((thana) => (
//                 <View key={thana.key} className="flex-row items-center rounded-full px-3 py-1 mr-2 mb-2" style={{ backgroundColor: LIGHT_BLUE }}>
//                   <Text style={{ color: PRIMARY_COLOR }}>{thana.value}</Text>
//                   <TouchableOpacity onPress={() => handleRemoveServiceThana(thana.key)} className="ml-2">
//                     <Text className="text-red-500 font-bold">×</Text>
//                   </TouchableOpacity>
//                 </View>
//               ))}
//             </View>
//           )}
//         </View>
        
//         {/* Address Information Section */}
//         <View className="bg-white rounded-xl shadow-md p-5 mb-6">
//           <View className="flex-row items-center mb-4">
//             <View className="w-8 h-8 rounded-full items-center justify-center mr-3" style={{ backgroundColor: LIGHT_BLUE }}>
//               <Text className="font-bold" style={{ color: PRIMARY_COLOR }}>4</Text>
//             </View>
//             <Text className="text-xl font-bold" style={{ color: PRIMARY_COLOR }}>Address Information</Text>
//           </View>
          
//           {/* Present Address Section */}
//           <Text className="text-lg font-semibold mt-2 mb-4" style={{ color: PRIMARY_COLOR }}>Present Address</Text>
          
//           <TextInput
//             placeholder="Full Address (House/Road No)"
//             placeholderTextColor="#999"
//             value={presentAddress}
//             onChangeText={(text) => {
//               setPresentAddress(text);
//               update({ presentAddress: text });
//             }}
//             multiline
//             numberOfLines={3}
//             className="border border-gray-300 p-3 mb-4 rounded-lg text-black h-20 text-base"
//           />
          
//           <AddressDropdown
//             label="Division"
//             data={divisions}
//             onSelect={handlePresentDivisionSelect}
//             placeholder="Select Division"
//             defaultOption={presentDivision}
//           />
          
//           <AddressDropdown
//             label="District"
//             data={availablePresentDistricts}
//             onSelect={handlePresentDistrictSelect}
//             placeholder={presentDivision ? 'Select District' : 'First select Division'}
//             disabled={!presentDivision}
//             defaultOption={presentDistrict}
//           />
          
//           <AddressDropdown
//             label="Thana/Police Station"
//             data={availablePresentThanas}
//             onSelect={handlePresentThanaSelect}
//             placeholder={presentDistrict ? 'Select Thana' : 'First select District'}
//             disabled={!presentDistrict}
//             defaultOption={presentThana}
//           />
          
//           {/* Permanent Address Section */}
//           <Text className="text-lg font-semibold mt-6 mb-4" style={{ color: PRIMARY_COLOR }}>Permanent Address</Text>
          
//           <TextInput
//             placeholder="Full Address (House/Road No)"
//             placeholderTextColor="#999"
//             value={permanentAddress}
//             onChangeText={(text) => {
//               setPermanentAddress(text);
//               update({ permanentAddress: text });
//             }}
//             multiline
//             numberOfLines={3}
//             className="border border-gray-300 p-3 mb-4 rounded-lg text-black h-20 text-base"
//           />
          
//           <AddressDropdown
//             label="Division"
//             data={divisions}
//             onSelect={handlePermanentDivisionSelect}
//             placeholder="Select Division"
//             defaultOption={permanentDivision}
//           />
          
//           <AddressDropdown
//             label="District"
//             data={availablePermanentDistricts}
//             onSelect={handlePermanentDistrictSelect}
//             placeholder={permanentDivision ? 'Select District' : 'First select Division'}
//             disabled={!permanentDivision}
//             defaultOption={permanentDistrict}
//           />
          
//           <AddressDropdown
//             label="Thana/Police Station"
//             data={availablePermanentThanas}
//             onSelect={handlePermanentThanaSelect}
//             placeholder={permanentDistrict ? 'Select Thana' : 'First select District'}
//             disabled={!permanentDistrict}
//             defaultOption={permanentThana}
//           />
//         </View>
        
//         {/* Document Upload Section */}
//         <View className="bg-white rounded-xl shadow-md p-5 mb-6">
//           <View className="flex-row items-center mb-4">
//             <View className="w-8 h-8 rounded-full items-center justify-center mr-3" style={{ backgroundColor: LIGHT_BLUE }}>
//               <Text className="font-bold" style={{ color: PRIMARY_COLOR }}>5</Text>
//             </View>
//             <Text className="text-xl font-bold" style={{ color: PRIMARY_COLOR }}>Document Upload</Text>
//           </View>
          
//           {/* CV/Resume Upload */}
//           <Text className="text-base font-medium mb-2">CV/Resume (PDF)</Text>
//           <TouchableOpacity 
//             onPress={handlePickCv}
//             className="border border-gray-300 p-3 mb-4 rounded-lg justify-center flex-row items-center"
//           >
//             <Text className="text-gray-700 flex-1">
//               {cvFile ? cvFile.name : 'Select CV/Resume'}
//             </Text>
//             <Text className="font-medium" style={{ color: PRIMARY_COLOR }}>Browse</Text>
//           </TouchableOpacity>
          
//           {/* Trade License Upload */}
//           <Text className="text-base font-medium mb-2">Trade License (PDF)</Text>
//           <TouchableOpacity 
//             onPress={handlePickTradeLicense}
//             className="border border-gray-300 p-3 mb-4 rounded-lg justify-center flex-row items-center"
//           >
//             <Text className="text-gray-700 flex-1">
//               {tradeLicenseFile ? tradeLicenseFile.name : 'Select Trade License'}
//             </Text>
//             <Text className="font-medium" style={{ color: PRIMARY_COLOR }}>Browse</Text>
//           </TouchableOpacity>
//         </View>
        
//         <Button
//           title={loading ? 'Submitting...' : 'Next'}
//           onPress={handleNext}
//           disabled={loading}
//           className="mt-6 rounded-xl py-4"
//           style={{ backgroundColor: PRIMARY_COLOR }}
//         />
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// }
// export default RegisterStep1;

import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import { useEffect, useState, useCallback } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { AddressDropdown } from '../../../components/ui/AddressDropdown';
import Button from '../../../components/ui/Button';
import { districts, divisions, thanas } from '../../../utils/addressData';
import { useVendorData } from '../../../store/useVendorStore';
import * as DocumentPicker from 'expo-document-picker';
import servicesData from '../../../utils/services.json'; 
import { Ionicons } from '@expo/vector-icons';

// Define Olympic blue as primary color
const PRIMARY_COLOR = '#0085C7';
const LIGHT_BLUE = '#E6F2F8';
const BORDER_COLOR = '#D1E7F5';

function RegisterStep1() {
  //direct state access
  const data = useVendorData(state => state.data);
  const update = useVendorData(state => state.update);
  
  // Form data state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  
  // Date of birth - initialize as empty string instead of current date
  const [dob, setDob] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  // Address selections
  const [selectedDivision, setSelectedDivision] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedThana, setSelectedThana] = useState(null);
  
  // Available options based on selections
  const [availableDistricts, setAvailableDistricts] = useState([]);
  const [availableThanas, setAvailableThanas] = useState([]);
  
  // Service Area state
  const [serviceDivision, setServiceDivision] = useState(null);
  const [serviceDistrict, setServiceDistrict] = useState(null);
  const [serviceThanas, setServiceThanas] = useState([]);
  const [availableServiceDistricts, setAvailableServiceDistricts] = useState([]);
  const [availableServiceThanas, setAvailableServiceThanas] = useState([]);
  
  // Document Upload state
  const [cvFile, setCvFile] = useState(null);
  const [tradeLicenseFile, setTradeLicenseFile] = useState(null);
  
  // Business Information state
  const [businessName, setBusinessName] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');
  
  // Present Address state
  const [presentAddress, setPresentAddress] = useState('');
  const [presentDivision, setPresentDivision] = useState(null);
  const [presentDistrict, setPresentDistrict] = useState(null);
  const [presentThana, setPresentThana] = useState(null);
  const [availablePresentDistricts, setAvailablePresentDistricts] = useState([]);
  const [availablePresentThanas, setAvailablePresentThanas] = useState([]);
  
  // Permanent Address state
  const [permanentAddress, setPermanentAddress] = useState('');
  const [permanentDivision, setPermanentDivision] = useState(null);
  const [permanentDistrict, setPermanentDistrict] = useState(null);
  const [permanentThana, setPermanentThana] = useState(null);
  const [availablePermanentDistricts, setAvailablePermanentDistricts] = useState([]);
  const [availablePermanentThanas, setAvailablePermanentThanas] = useState([]);
  
 // Provided Services state
  const [providedServices, setProvidedServices] = useState([]);
  
  const [loading, setLoading] = useState(false);
  
  // Initialize form data from store
  useEffect(() => {
    if (!data) return;
    
    console.log("Loading data from Zustand store:", data);
    
    setFormData({
      name: data.name || '',
      email: data.email || '',
      phone: data.phone || '',
      address: data.address || '',
    });
    
    // Initialize DOB from store or keep empty
    if (data.dob) {
      setDob(new Date(data.dob));
    }
    
    if (data.divisionKey) {
      setSelectedDivision(data.divisionKey);
      setAvailableDistricts(districts[data.divisionKey] || []);
    }
    if (data.districtKey) {
      setSelectedDistrict(data.districtKey);
      setAvailableThanas(thanas[data.districtKey] || []);
    }
    if (data.thanaKey) {
      setSelectedThana(data.thanaKey);
    }
    
    // Initialize service area from store
    if (data.serviceDivisionKey) {
      setServiceDivision(data.serviceDivisionKey);
      setAvailableServiceDistricts(districts[data.serviceDivisionKey] || []);
    }
    if (data.serviceDistrictKey) {
      setServiceDistrict(data.serviceDistrictKey);
      setAvailableServiceThanas(thanas[data.serviceDistrictKey] || []);
    }
    if (data.serviceThanas) {
      setServiceThanas(data.serviceThanas);
    }
    
    // Initialize documents from store
    if (data.cvFile) setCvFile(data.cvFile);
    if (data.tradeLicenseFile) setTradeLicenseFile(data.tradeLicenseFile);
    
    // Initialize business information from store
    setBusinessName(data.businessName || '');
    setBusinessDescription(data.businessDescription || '');
    
    // Initialize present address from store
    setPresentAddress(data.presentAddress || '');
    if (data.presentDivisionKey) {
      setPresentDivision(data.presentDivisionKey);
      setAvailablePresentDistricts(districts[data.presentDivisionKey] || []);
    }
    if (data.presentDistrictKey) {
      setPresentDistrict(data.presentDistrictKey);
      setAvailablePresentThanas(thanas[data.presentDistrictKey] || []);
    }
    if (data.presentThanaKey) {
      setPresentThana(data.presentThanaKey);
    }
    
    // Initialize permanent address from store
    setPermanentAddress(data.permanentAddress || '');
    if (data.permanentDivisionKey) {
      setPermanentDivision(data.permanentDivisionKey);
      setAvailablePermanentDistricts(districts[data.permanentDivisionKey] || []);
    }
    if (data.permanentDistrictKey) {
      setPermanentDistrict(data.permanentDistrictKey);
      setAvailablePermanentThanas(thanas[data.permanentDistrictKey] || []);
    }
    if (data.permanentThanaKey) {
      setPermanentThana(data.permanentThanaKey);
    }
    
    // Initialize provided services from store
    if (data.providedServices) {
      setProvidedServices(data.providedServices);
    }
  }, [data]);
  
  // Division select handler
  const handleDivisionSelect = (divisionKey) => {
    const divisionObj = divisions.find(d => d.key === divisionKey) || { value: '' };
    setSelectedDivision(divisionKey);
    setAvailableDistricts(districts[divisionKey] || []);
    update({
      divisionKey,
      divisionValue: divisionObj.value,
      districtKey: '',
      districtValue: '',
      thanaKey: '',
      thanaValue: '',
    });
  };
  
  // District select handler
  const handleDistrictSelect = (districtKey) => {
    const districtList = districts[selectedDivision] || [];
    const districtObj = districtList.find(d => d.key === districtKey) || { value: '' };
    setSelectedDistrict(districtKey);
    setAvailableThanas(thanas[districtKey] || []);
    update({
      districtKey,
      districtValue: districtObj.value,
      thanaKey: '',
      thanaValue: '',
    });
  };
  
  // Thana select handler
  const handleThanaSelect = (thanaKey) => {
    const thanaList = thanas[selectedDistrict] || [];
    const thanaObj = thanaList.find(t => t.key === thanaKey) || { value: '' };
    setSelectedThana(thanaKey);
    update({
      thanaKey,
      thanaValue: thanaObj.value,
    });
  };
  
  // Service Area Division select handler
  const handleServiceDivisionSelect = (divisionKey) => {
    const divisionObj = divisions.find(d => d.key === divisionKey) || { value: '' };
    setServiceDivision(divisionKey);
    setAvailableServiceDistricts(districts[divisionKey] || []);
    setServiceDistrict(null);
    setServiceThanas([]);
    update({
      serviceDivisionKey: divisionKey,
      serviceDivisionValue: divisionObj.value,
      serviceDistrictKey: '',
      serviceDistrictValue: '',
      serviceThanas: [],
    });
  };
  
  // Service Area District select handler
  const handleServiceDistrictSelect = (districtKey) => {
    const districtList = districts[serviceDivision] || [];
    const districtObj = districtList.find(d => d.key === districtKey) || { value: '' };
    setServiceDistrict(districtKey);
    setAvailableServiceThanas(thanas[districtKey] || []);
    setServiceThanas([]);
    update({
      serviceDistrictKey: districtKey,
      serviceDistrictValue: districtObj.value,
      serviceThanas: [],
    });
  };
  
  // Service Area Thana select handler
  const handleServiceThanaSelect = (thanaKey) => {
    const thanaList = thanas[serviceDistrict] || [];
    const thanaObj = thanaList.find(t => t.key === thanaKey) || { value: '' };
    
    // Check if thana is already selected
    if (!serviceThanas.some(t => t.key === thanaKey)) {
      const updatedThanas = [...serviceThanas, { key: thanaKey, value: thanaObj.value }];
      setServiceThanas(updatedThanas);
      update({ serviceThanas: updatedThanas });
    }
  };
  
  // Remove selected thana from service area
  const handleRemoveServiceThana = (thanaKey) => {
    const updatedThanas = serviceThanas.filter(t => t.key !== thanaKey);
    setServiceThanas(updatedThanas);
    update({ serviceThanas: updatedThanas });
  };
  
  // Business Information handlers
  const handleBusinessNameChange = useCallback((text) => {
    setBusinessName(text);
    update({ businessName: text });
  }, []);
  
  const handleBusinessDescriptionChange = useCallback((text) => {
    setBusinessDescription(text);
    update({ businessDescription: text });
  }, []);
  
  // Present Address handlers
  const handlePresentDivisionSelect = (divisionKey) => {
    const divisionObj = divisions.find(d => d.key === divisionKey) || { value: '' };
    setPresentDivision(divisionKey);
    setAvailablePresentDistricts(districts[divisionKey] || []);
    setPresentDistrict(null);
    setPresentThana(null);
    update({
      presentDivisionKey: divisionKey,
      presentDivisionValue: divisionObj.value,
      presentDistrictKey: '',
      presentDistrictValue: '',
      presentThanaKey: '',
      presentThanaValue: '',
    });
  };
  
  const handlePresentDistrictSelect = (districtKey) => {
    const districtList = districts[presentDivision] || [];
    const districtObj = districtList.find(d => d.key === districtKey) || { value: '' };
    setPresentDistrict(districtKey);
    setAvailablePresentThanas(thanas[districtKey] || []);
    setPresentThana(null);
    update({
      presentDistrictKey: districtKey,
      presentDistrictValue: districtObj.value,
      presentThanaKey: '',
      presentThanaValue: '',
    });
  };
  
  const handlePresentThanaSelect = (thanaKey) => {
    const thanaList = thanas[presentDistrict] || [];
    const thanaObj = thanaList.find(t => t.key === thanaKey) || { value: '' };
    setPresentThana(thanaKey);
    update({
      presentThanaKey: thanaKey,
      presentThanaValue: thanaObj.value,
    });
  };
  
  // Permanent Address handlers
  const handlePermanentDivisionSelect = (divisionKey) => {
    const divisionObj = divisions.find(d => d.key === divisionKey) || { value: '' };
    setPermanentDivision(divisionKey);
    setAvailablePermanentDistricts(districts[divisionKey] || []);
    setPermanentDistrict(null);
    setPermanentThana(null);
    update({
      permanentDivisionKey: divisionKey,
      permanentDivisionValue: divisionObj.value,
      permanentDistrictKey: '',
      permanentDistrictValue: '',
      permanentThanaKey: '',
      permanentThanaValue: '',
    });
  };
  
  const handlePermanentDistrictSelect = (districtKey) => {
    const districtList = districts[permanentDivision] || [];
    const districtObj = districtList.find(d => d.key === districtKey) || { value: '' };
    setPermanentDistrict(districtKey);
    setAvailablePermanentThanas(thanas[districtKey] || []);
    setPermanentThana(null);
    update({
      permanentDistrictKey: districtKey,
      permanentDistrictValue: districtObj.value,
      permanentThanaKey: '',
      permanentThanaValue: '',
    });
  };
  
  const handlePermanentThanaSelect = (thanaKey) => {
    const thanaList = thanas[permanentDistrict] || [];
    const thanaObj = thanaList.find(t => t.key === thanaKey) || { value: '' };
    setPermanentThana(thanaKey);
    update({
      permanentThanaKey: thanaKey,
      permanentThanaValue: thanaObj.value,
    });
  };
  
  // Provided Services handlers
  const handleServiceSelect = (serviceKey) => {
    const serviceObj = servicesData.find(s => s.key === serviceKey) || { value: '' };
    
    // Check if service is already selected
    if (!providedServices.some(s => s.key === serviceKey)) {
      const updatedServices = [...providedServices, { key: serviceKey, value: serviceObj.value }];
      setProvidedServices(updatedServices);
      update({ providedServices: updatedServices });
    }
  };
  
  const handleRemoveService = (serviceKey) => {
    const updatedServices = providedServices.filter(s => s.key !== serviceKey);
    setProvidedServices(updatedServices);
    update({ providedServices: updatedServices });
  };
  
  // CV/Resume Picker
  const handlePickCv = async () => {
    try {
      console.log("Starting CV document picker...");
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });
      console.log("Document picker result:", result);
      if (!result.canceled && result.assets?.length > 0) {
        const asset = result.assets[0];
        const file = {
          name: asset.name,
          uri: asset.uri,
          type: asset.mimeType || 'application/pdf',
          size: asset.size
        };
        console.log("Selected CV file:", file);
        setCvFile(file);
        update({ cvFile: file });
        Alert.alert('Success', 'CV/Resume uploaded successfully');
      } else {
        console.log("User cancelled document picker");
      }
    } catch (err) {
      console.error('DocumentPicker Error: ', err);
      Alert.alert('Error', 'Failed to pick CV/Resume: ' + err.message);
    }
  };
  
  // Trade License Picker
  const handlePickTradeLicense = async () => {
    try {
      console.log("Starting Trade License document picker...");
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });
      console.log("Document picker result:", result);
      if (!result.canceled && result.assets?.length > 0) {
        const asset = result.assets[0];
        const file = {
          name: asset.name,
          uri: asset.uri,
          type: asset.mimeType || 'application/pdf',
          size: asset.size
        };
        console.log("Selected Trade License file:", file);
        setTradeLicenseFile(file);
        update({ tradeLicenseFile: file });
        Alert.alert('Success', 'Trade License uploaded successfully');
      } else {
        console.log("User cancelled document picker");
      }
    } catch (err) {
      console.error('DocumentPicker Error: ', err);
      Alert.alert('Error', 'Failed to pick Trade License: ' + err.message);
    }
  };
  
  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Save to Zustand immediately
    update({ [field]: value });
  }, []);
  
  const onChangeDate = useCallback((event, selectedDate) => {
    if (event.type === 'set') {
      setDob(selectedDate);
      // Save to Zustand store
      update({ dob: selectedDate.toISOString() });
      if (Platform.OS === 'android') setShowDatePicker(false);
    } else {
      setShowDatePicker(false);
    }
  }, []);
  
  const validate = useCallback(() => {
    if (!formData.name || formData.name.length < 3) {
      Alert.alert('Invalid Name', 'Name must be at least 3 characters');
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return false;
    }
    if (!/^(?:\+88|01)?\d{11}$/.test(formData.phone)) {
      Alert.alert('Invalid Phone', 'Please enter a valid Bangladeshi phone number');
      return false;
    }
    
    // Check if DOB is selected
    if (!dob) {
      Alert.alert('Missing Information', 'Please select your date of birth');
      return false;
    }
    
    const age = new Date().getFullYear() - new Date(dob).getFullYear();
    if (age < 18) {
      Alert.alert('Age Restriction', 'You must be at least 18 years old');
      return false;
    }
    if (!formData.address || !selectedDivision || !selectedDistrict || !selectedThana) {
      Alert.alert('Missing Information', 'Please fill all business address fields');
      return false;
    }
    if (!serviceDivision || !serviceDistrict || serviceThanas.length === 0) {
      Alert.alert('Missing Information', 'Please select at least one service area');
      return false;
    }
    if (!businessName || businessName.length < 3) {
      Alert.alert('Invalid Business Name', 'Business name must be at least 3 characters');
      return false;
    }
    if (!presentAddress || !presentDivision || !presentDistrict || !presentThana) {
      Alert.alert('Missing Information', 'Please fill all present address fields');
      return false;
    }
    if (!permanentAddress || !permanentDivision || !permanentDistrict || !permanentThana) {
      Alert.alert('Missing Information', 'Please fill all permanent address fields');
      return false;
    }
    if (providedServices.length === 0) {
      Alert.alert('Missing Information', 'Please select at least one provided service');
      return false;
    }
    if (!cvFile) {
      Alert.alert('Missing Document', 'Please upload your CV/Resume');
      return false;
    }
    if (!tradeLicenseFile) {
      Alert.alert('Missing Document', 'Please upload your Trade License');
      return false;
    }
    return true;
  }, [formData, dob, selectedDivision, selectedDistrict, selectedThana, 
      serviceDivision, serviceDistrict, serviceThanas, businessName, 
      presentAddress, presentDivision, presentDistrict, presentThana,
      permanentAddress, permanentDivision, permanentDistrict, permanentThana,
      providedServices, cvFile, tradeLicenseFile]);
  
  const handleNext = useCallback(async () => {
    if (!validate()) return;
    
    // Log current data before saving
    console.log("Saving data to Zustand store:", {
      ...formData,
      dob: dob ? new Date(dob).toISOString() : null,
      divisionKey: selectedDivision,
      districtKey: selectedDistrict,
      thanaKey: selectedThana,
      serviceDivisionKey: serviceDivision,
      serviceDistrictKey: serviceDistrict,
      serviceThanas: serviceThanas,
      businessName,
      businessDescription,
      presentAddress,
      presentDivisionKey: presentDivision,
      presentDistrictKey: presentDistrict,
      presentThanaKey: presentThana,
      permanentAddress,
      permanentDivisionKey: permanentDivision,
      permanentDistrictKey: permanentDistrict,
      permanentThanaKey: permanentThana,
      providedServices,
      cvFile: cvFile,
      tradeLicenseFile: tradeLicenseFile,
    });
    
    setLoading(true);
    try {
      const payload = {
        ...formData,
        dob: dob ? new Date(dob).toISOString() : null,
        divisionKey: selectedDivision,
        districtKey: selectedDistrict,
        thanaKey: selectedThana,
        serviceDivisionKey: serviceDivision,
        serviceDistrictKey: serviceDistrict,
        serviceThanas: serviceThanas,
        businessName,
        businessDescription,
        presentAddress,
        presentDivisionKey: presentDivision,
        presentDistrictKey: presentDistrict,
        presentThanaKey: presentThana,
        permanentAddress,
        permanentDivisionKey: permanentDivision,
        permanentDistrictKey: permanentDistrict,
        permanentThanaKey: permanentThana,
        providedServices,
        cvFile: cvFile,
        tradeLicenseFile: tradeLicenseFile,
      };
      await update(payload);
      console.log("Data successfully saved to Zustand store");
      router.push('/auth/register/RegisterStep2');
    } catch (error) {
      Alert.alert('Error', 'Failed to proceed to next step');
      console.error('Registration Error:', error);
    } finally {
      setLoading(false);
    }
  }, [formData, dob, selectedDivision, selectedDistrict, selectedThana, 
      serviceDivision, serviceDistrict, serviceThanas, businessName, 
      presentAddress, presentDivision, presentDistrict, presentThana,
      permanentAddress, permanentDivision, permanentDistrict, permanentThana,
      providedServices, cvFile, tradeLicenseFile, validate, update]);
  
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        {/* Fixed Header */}
        <View className="p-4 border-b border-gray-200">
          <Text className="text-3xl mt-10 font-bold text-center" style={{ color: PRIMARY_COLOR }}>Vendor Registration</Text>
          <View className="w-16 h-1 rounded-full mt-2 self-center" style={{ backgroundColor: PRIMARY_COLOR }} />
        </View>
        
        {/* Scrollable Content */}
        <ScrollView className="flex-1 p-4" contentContainerStyle={{ paddingBottom: 20 }}>
          {/* Personal Information Section */}
          <View className="bg-white rounded-xl shadow-sm p-5 mb-6 border border-gray-100">
            <View className="flex-row items-center mb-4">
              <View className="w-8 h-8 rounded-full items-center justify-center mr-3" style={{ backgroundColor: LIGHT_BLUE }}>
                <Text className="font-bold" style={{ color: PRIMARY_COLOR }}>1</Text>
              </View>
              <Text className="text-xl font-bold" style={{ color: PRIMARY_COLOR }}>Personal Information</Text>
            </View>
            
            <TextInput
              placeholder="Full Name"
              placeholderTextColor="#999"
              value={formData.name}
              onChangeText={(text) => handleInputChange('name', text)}
              className="border border-gray-300 p-3 mb-4 rounded-lg text-black bg-white"
            />
            <TextInput
              placeholder="Email"
              placeholderTextColor="#999"
              value={formData.email}
              onChangeText={(text) => handleInputChange('email', text)}
              keyboardType="email-address"
              autoCapitalize="none"
              className="border border-gray-300 p-3 mb-4 rounded-lg text-black bg-white"
            />
            <TextInput
              placeholder="Phone Number"
              placeholderTextColor="#999"
              value={formData.phone}
              onChangeText={(text) => handleInputChange('phone', text)}
              keyboardType="phone-pad"
              className="border border-gray-300 p-3 mb-4 rounded-lg text-black bg-white"
            />
            <TouchableOpacity 
              onPress={() => setShowDatePicker(true)} 
              className="border border-gray-300 p-3 mb-4 rounded-lg justify-center bg-white"
            >
              <Text className="text-black">
                {dob ? new Date(dob).toDateString() : 'Select Date of Birth'}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={dob ? new Date(dob) : new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onChangeDate}
                maximumDate={new Date()}
              />
            )}
          </View>
          
          {/* Business Information Section */}
          <View className="bg-white rounded-xl shadow-sm p-5 mb-6 border border-gray-100">
            <View className="flex-row items-center mb-4">
              <View className="w-8 h-8 rounded-full items-center justify-center mr-3" style={{ backgroundColor: LIGHT_BLUE }}>
                <Text className="font-bold" style={{ color: PRIMARY_COLOR }}>2</Text>
              </View>
              <Text className="text-xl font-bold" style={{ color: PRIMARY_COLOR }}>Business Information</Text>
            </View>
            
            <TextInput
              placeholder="Business Name"
              placeholderTextColor="#999"
              value={businessName}
              onChangeText={handleBusinessNameChange}
              className="border border-gray-300 p-3 mb-4 rounded-lg text-black bg-white"
            />
            
            <TextInput
              placeholder="Business Description"
              placeholderTextColor="#999"
              value={businessDescription}
              onChangeText={handleBusinessDescriptionChange}
              multiline
              numberOfLines={3}
              className="border border-gray-300 p-3 mb-4 rounded-lg text-black bg-white h-20 text-base"
            />
            
            {/* Business Address Information Section */}
            <Text className="text-lg font-semibold mt-2 mb-4" style={{ color: PRIMARY_COLOR }}>Business Address</Text>
            <TextInput
              placeholder="Full Address (House/Road No)"
              placeholderTextColor="#999"
              value={formData.address}
              onChangeText={(text) => handleInputChange('address', text)}
              multiline
              numberOfLines={3}
              className="border border-gray-300 p-3 mb-4 rounded-lg text-black bg-white h-20 text-base"
            />
            <AddressDropdown
              label="Division"
              data={divisions}
              onSelect={handleDivisionSelect}
              placeholder="Select Division"
              defaultOption={selectedDivision}
            />
            <AddressDropdown
              label="District"
              data={availableDistricts}
              onSelect={handleDistrictSelect}
              placeholder={selectedDivision ? 'Select District' : 'First select Division'}
              disabled={!selectedDivision}
              defaultOption={selectedDistrict}
            />
            <AddressDropdown
              label="Thana/Police Station"
              data={availableThanas}
              onSelect={handleThanaSelect}
              placeholder={selectedDistrict ? 'Select Thana' : 'First select District'}
              disabled={!selectedDistrict}
              defaultOption={selectedThana}
            />
          </View>
          
          {/* Provided Services Section */}
          <View className="bg-white rounded-xl shadow-sm p-5 mb-6 border border-gray-100">
            <View className="flex-row items-center mb-4">
              <View className="w-8 h-8 rounded-full items-center justify-center mr-3" style={{ backgroundColor: LIGHT_BLUE }}>
                <Text className="font-bold" style={{ color: PRIMARY_COLOR }}>3</Text>
              </View>
              <Text className="text-xl font-bold" style={{ color: PRIMARY_COLOR }}>Services</Text>
            </View>
            
            <Text className="text-base font-medium mb-2">Provided Services</Text>
            
            {/* Service Dropdown */}
            <AddressDropdown
              label=""
              data={servicesData}
              onSelect={handleServiceSelect}
              placeholder="Select a service"
            />
            
            {/* Selected Services Display */}
            {providedServices.length > 0 && (
              <View className="flex-row flex-wrap mt-2">
                {providedServices.map((service) => (
                  <View key={service.key} className="flex-row items-center rounded-full px-3 py-1 mr-2 mb-2" style={{ backgroundColor: LIGHT_BLUE }}>
                    <Text style={{ color: PRIMARY_COLOR }}>{service.value}</Text>
                    <TouchableOpacity onPress={() => handleRemoveService(service.key)} className="ml-2">
                      <Text className="text-red-500 font-bold">×</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
            
            {/* Service Area Section */}
            <Text className="text-lg font-semibold mt-6 mb-4" style={{ color: PRIMARY_COLOR }}>Service Area</Text>
            <AddressDropdown
              label="Division"
              data={divisions}
              onSelect={handleServiceDivisionSelect}
              placeholder="Select Division"
              defaultOption={serviceDivision}
            />
            <AddressDropdown
              label="District"
              data={availableServiceDistricts}
              onSelect={handleServiceDistrictSelect}
              placeholder={serviceDivision ? 'Select District' : 'First select Division'}
              disabled={!serviceDivision}
              defaultOption={serviceDistrict}
            />
            
            {/* Thana Multi-Select */}
            <Text className="text-base font-medium mb-2">Thana/Police Station</Text>
            <AddressDropdown
              label=""
              data={availableServiceThanas}
              onSelect={handleServiceThanaSelect}
              placeholder={serviceDistrict ? 'Select Thana' : 'First select District'}
              disabled={!serviceDistrict}
            />
            
            {/* Selected Thanas Display */}
            {serviceThanas.length > 0 && (
              <View className="flex-row flex-wrap mt-2">
                {serviceThanas.map((thana) => (
                  <View key={thana.key} className="flex-row items-center rounded-full px-3 py-1 mr-2 mb-2" style={{ backgroundColor: LIGHT_BLUE }}>
                    <Text style={{ color: PRIMARY_COLOR }}>{thana.value}</Text>
                    <TouchableOpacity onPress={() => handleRemoveServiceThana(thana.key)} className="ml-2">
                      <Text className="text-red-500 font-bold">×</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
          
          {/* Address Information Section */}
          <View className="bg-white rounded-xl shadow-sm p-5 mb-6 border border-gray-100">
            <View className="flex-row items-center mb-4">
              <View className="w-8 h-8 rounded-full items-center justify-center mr-3" style={{ backgroundColor: LIGHT_BLUE }}>
                <Text className="font-bold" style={{ color: PRIMARY_COLOR }}>4</Text>
              </View>
              <Text className="text-xl font-bold" style={{ color: PRIMARY_COLOR }}>Address Information</Text>
            </View>
            
            {/* Present Address Section */}
            <Text className="text-lg font-semibold mt-2 mb-4" style={{ color: PRIMARY_COLOR }}>Present Address</Text>
            
            <TextInput
              placeholder="Full Address (House/Road No)"
              placeholderTextColor="#999"
              value={presentAddress}
              onChangeText={(text) => {
                setPresentAddress(text);
                update({ presentAddress: text });
              }}
              multiline
              numberOfLines={3}
              className="border border-gray-300 p-3 mb-4 rounded-lg text-black bg-white h-20 text-base"
            />
            
            <AddressDropdown
              label="Division"
              data={divisions}
              onSelect={handlePresentDivisionSelect}
              placeholder="Select Division"
              defaultOption={presentDivision}
            />
            <AddressDropdown
              label="District"
              data={availablePresentDistricts}
              onSelect={handlePresentDistrictSelect}
              placeholder={presentDivision ? 'Select District' : 'First select Division'}
              disabled={!presentDivision}
              defaultOption={presentDistrict}
            />
            <AddressDropdown
              label="Thana/Police Station"
              data={availablePresentThanas}
              onSelect={handlePresentThanaSelect}
              placeholder={presentDistrict ? 'Select Thana' : 'First select District'}
              disabled={!presentDistrict}
              defaultOption={presentThana}
            />
            
            {/* Permanent Address Section */}
            <Text className="text-lg font-semibold mt-6 mb-4" style={{ color: PRIMARY_COLOR }}>Permanent Address</Text>
            
            <TextInput
              placeholder="Full Address (House/Road No)"
              placeholderTextColor="#999"
              value={permanentAddress}
              onChangeText={(text) => {
                setPermanentAddress(text);
                update({ permanentAddress: text });
              }}
              multiline
              numberOfLines={3}
              className="border border-gray-300 p-3 mb-4 rounded-lg text-black bg-white h-20 text-base"
            />
            
            <AddressDropdown
              label="Division"
              data={divisions}
              onSelect={handlePermanentDivisionSelect}
              placeholder="Select Division"
              defaultOption={permanentDivision}
            />
            <AddressDropdown
              label="District"
              data={availablePermanentDistricts}
              onSelect={handlePermanentDistrictSelect}
              placeholder={permanentDivision ? 'Select District' : 'First select Division'}
              disabled={!permanentDivision}
              defaultOption={permanentDistrict}
            />
            <AddressDropdown
              label="Thana/Police Station"
              data={availablePermanentThanas}
              onSelect={handlePermanentThanaSelect}
              placeholder={permanentDistrict ? 'Select Thana' : 'First select District'}
              disabled={!permanentDistrict}
              defaultOption={permanentThana}
            />
          </View>
          
          {/* Document Upload Section */}
          <View className="bg-white rounded-xl shadow-sm p-5 mb-6 border border-gray-100">
            <View className="flex-row items-center mb-4">
              <View className="w-8 h-8 rounded-full items-center justify-center mr-3" style={{ backgroundColor: LIGHT_BLUE }}>
                <Text className="font-bold" style={{ color: PRIMARY_COLOR }}>5</Text>
              </View>
              <Text className="text-xl font-bold" style={{ color: PRIMARY_COLOR }}>Document Upload</Text>
            </View>
            
            {/* CV/Resume Upload */}
            <Text className="text-base font-medium mb-2">CV/Resume (PDF)</Text>
            <TouchableOpacity 
              onPress={handlePickCv}
              className="border border-gray-300 p-3 mb-4 rounded-lg justify-center flex-row items-center bg-white"
            >
              <Text className="text-gray-700 flex-1">
                {cvFile ? cvFile.name : 'Select CV/Resume'}
              </Text>
              <Text className="font-medium" style={{ color: PRIMARY_COLOR }}>Browse</Text>
            </TouchableOpacity>
            
            {/* Trade License Upload */}
            <Text className="text-base font-medium mb-2">Trade License (PDF)</Text>
            <TouchableOpacity 
              onPress={handlePickTradeLicense}
              className="border border-gray-300 p-3 mb-4 rounded-lg justify-center flex-row items-center bg-white"
            >
              <Text className="text-gray-700 flex-1">
                {tradeLicenseFile ? tradeLicenseFile.name : 'Select Trade License'}
              </Text>
              <Text className="font-medium" style={{ color: PRIMARY_COLOR }}>Browse</Text>
            </TouchableOpacity>
          </View>
          
          <Button
            title={loading ? 'Submitting...' : 'Next'}
            onPress={handleNext}
            disabled={loading}
            className="mt-2 rounded-xl py-4"
            style={{ backgroundColor: PRIMARY_COLOR }}
          />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

export default RegisterStep1;