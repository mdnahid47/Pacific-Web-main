// import React, { useState, useCallback, useEffect } from 'react';
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
// import auth from '@react-native-firebase/auth';
// import { useVendorData } from '../../../store/useVendorStore';
// import { router } from 'expo-router';
// import Button from '../../../components/ui/Button';

// export default function OtpVerificationScreen() {
//   const { data } = useVendorData((state) => state);
//   const [verificationId, setVerificationId] = useState(null);
//   const [code, setCode] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [otpSent, setOtpSent] = useState(false);
//   const [resendDisabled, setResendDisabled] = useState(true);
//   const [countdown, setCountdown] = useState(30);

//   // Countdown timer for resend OTP
//   useEffect(() => {
//     let timer;
//     if (resendDisabled && countdown > 0) {
//       timer = setTimeout(() => setCountdown(countdown - 1), 1000);
//     } else if (countdown === 0) {
//       setResendDisabled(false);
//     }
//     return () => clearTimeout(timer);
//   }, [countdown, resendDisabled]);

//   const sendVerification = useCallback(async () => {
//     try {
//       setLoading(true);
//       const confirmation = await auth().signInWithPhoneNumber('+88' + data.phone);
//       setVerificationId(confirmation);
//       setOtpSent(true);
//       setResendDisabled(true);
//       setCountdown(30);
//       Alert.alert('OTP Sent', 'A 6-digit code has been sent to your phone.');
//     } catch (err) {
//       Alert.alert('Error', err.message || 'Failed to send OTP');
//     } finally {
//       setLoading(false);
//     }
//   }, [data.phone]);

//   const confirmCode = useCallback(async () => {
//     try {
//       if (!verificationId) {
//         Alert.alert('Error', 'Please request an OTP first');
//         return;
//       }
//       if (code.length !== 6) {
//         Alert.alert('Error', 'Please enter a valid 6-digit code');
//         return;
//       }
//       setLoading(true);
//       await verificationId.confirm(code);
//       router.push('/auth/register/RegisterStep4');
//     } catch (err) {
//       Alert.alert('Error', err.message || 'Invalid verification code');
//     } finally {
//       setLoading(false);
//     }
//   }, [verificationId, code]);

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//       className="flex-1 bg-gray-50"
//     >
//       <ScrollView
//         contentContainerStyle={{ flexGrow: 1 }}
//         keyboardShouldPersistTaps="handled"
//       >
//         <View className="flex-1 px-6 py-8">
//           {/* Header Section */}
//           <View className="mb-8">
//             <Text className="text-3xl font-bold text-gray-900 mb-2">Phone Verification</Text>
//             <Text className="text-gray-600">
//               Enter the 6-digit code sent to +88{data.phone}
//             </Text>
//           </View>

//           {/* OTP Input Section */}
//           <View className="mb-6">
//             <View className="flex-row justify-between items-center mb-3">
//               <Text className="text-sm font-medium text-gray-700">Verification Code</Text>
//               {otpSent && (
//                 <TouchableOpacity 
//                   onPress={sendVerification} 
//                   disabled={resendDisabled}
//                 >
//                   <Text className={`text-sm ${resendDisabled ? 'text-gray-400' : 'text-blue-600'}`}>
//                     {resendDisabled ? `Resend in ${countdown}s` : 'Resend Code'}
//                   </Text>
//                 </TouchableOpacity>
//               )}
//             </View>

//             <TextInput
//               placeholder="Enter 6-digit code"
//               placeholderTextColor="#9CA3AF"
//               value={code}
//               onChangeText={setCode}
//               keyboardType="number-pad"
//               maxLength={6}
//               className="w-full bg-white border border-gray-200 rounded-lg px-5 py-3 text-lg text-gray-900"
//             />
//           </View>

//           {/* Action Buttons */}
//           <View className="space-y-4">
//             {!otpSent ? (
//               <Button
//                 title="Send OTP"
//                 onPress={sendVerification}
//                 loading={loading}
//                 className="w-full py-3 rounded-lg bg-blue-600"
//               />
//             ) : (
//               <Button
//                 title="Verify & Continue"
//                 onPress={confirmCode}
//                 loading={loading}
//                 disabled={code.length !== 6}
//                 className="w-full py-3 rounded-lg bg-green-600"
//               />
//             )}
//           </View>

//           {/* Alternative Option */}

//         </View>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// }