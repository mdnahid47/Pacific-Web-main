
// import React, { useRef, useState } from 'react';
// import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, View } from 'react-native';
// import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
// import firebase from 'firebase/compat/app';
// import 'firebase/compat/auth';
// import Button from '../../../components/ui/Button';
// import { useVendorData } from '../../../store/useVendorStore';
// import { router } from 'expo-router';
// import { firebaseConfig } from '../../../lib/firebase';

// const Verify = () => {
//     const data = useVendorData((state) => state.data) || {};
// const update = useVendorData((state) => state.update) || (() => {});

//       const recaptchaVerifier = useRef(null);
    
//       const phoneNumber = data.phone || '';
//       const [verificationId, setVerificationId] = useState(null);
//       const [verificationCode, setVerificationCode] = useState('');
//       const [loading, setLoading] = useState(false);
    
//       const sendVerification = async () => {
//         if (!phoneNumber || phoneNumber.length < 11) {
//           Alert.alert('Invalid Phone', 'Phone number is invalid');
//           return;
//         }
    
//         try {
//           setLoading(true);
//           const phoneProvider = new firebase.auth.PhoneAuthProvider();
//           const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : '+88' + phoneNumber;
//           const id = await phoneProvider.verifyPhoneNumber(formattedPhone, recaptchaVerifier.current);
//           setVerificationId(id);
//           Alert.alert('Success', 'OTP sent to your phone');
//         } catch (err) {
//           Alert.alert('Error', err.message);
//         } finally {
//           setLoading(false);
//         }
//       };
    
//       const verifyCode = async () => {
//         if (!verificationCode || verificationCode.length < 6) {
//           Alert.alert('Invalid OTP', 'Please enter a 6-digit OTP code');
//           return;
//         }
    
//         try {
//           setLoading(true);
//           const credential = firebase.auth.PhoneAuthProvider.credential(verificationId, verificationCode);
//           await firebase.auth().signInWithCredential(credential);
    
//           update({ phoneVerified: true });
    
//           Alert.alert('Success', 'Phone number verified successfully');
//           router.push('/auth/register/register-step4');
//         } catch (err) {
//           Alert.alert('Verification failed', err.message);
//         } finally {
//           setLoading(false);
//         }
//       };
    
//   return (
//     <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-white">
//          <FirebaseRecaptchaVerifierModal ref={recaptchaVerifier} firebaseConfig={firebaseConfig} attemptInvisibleVerification />
//          <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20 }}>
//            <Text className="text-2xl font-bold mb-6">Verify Your Phone Number</Text>
//            <TextInput
//              placeholder="Phone Number"
//              keyboardType="phone-pad"
//              value={phoneNumber}
//              editable={false}
//              selectTextOnFocus={false}
//              className="border border-gray-300 p-3 mb-4 rounded text-base bg-gray-100"
//            />
   
//            <Button title={loading ? 'Sending OTP...' : 'Send OTP'} onPress={sendVerification} disabled={loading} className="mb-6" />
   
//            {verificationId && (
//              <>
//                <TextInput
//                  placeholder="Enter OTP"
//                  keyboardType="number-pad"
//                  value={verificationCode}
//                  onChangeText={setVerificationCode}
//                  className="border border-gray-300 p-3 mb-4 rounded text-base"
//                  maxLength={6}
//                />
//                <Button title={loading ? 'Verifying...' : 'Verify OTP'} onPress={verifyCode} disabled={loading} />
//              </>
//            )}
//          </ScrollView>
//        </KeyboardAvoidingView>
//   )
// }

// export default Verify;