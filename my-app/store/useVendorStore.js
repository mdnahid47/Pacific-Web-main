// import { create } from 'zustand';
// import { persist, createJSONStorage } from 'zustand/middleware';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { shallow } from 'zustand/shallow';

// const initialState = {
//   name: '',
//   email: '',
//   phone: '',
//   dob: '',
//   password: '',
//   address: '',
//   divisionKey: '',
//   divisionValue: '',
//   districtKey: '',
//   districtValue: '',
//   thanaKey: '',
//   thanaValue: '',
//   nid_number: '',
//   technician_quantity: '1',
//   nid_front: null,
//   nid_back: null,
//   selfie: null,
//   otp_verified: false,
//   registration_step: 1, // Track current registration step
// };

// const useVendorStore = create(
//   persist(
//     (set, get) => ({
//       data: initialState,

//       // Update store with new data
//       update: (newData) => {
//         set((state) => ({
//           data: {
//             ...state.data,
//             ...newData,
//           },
//         }));
//       },

//       // Prepare complete data for submission
//       prepareSubmissionData: () => {
//         const { data } = get();
//         return {
//           ...data,
//           // Add any transformations here
//           dob: data.dob instanceof Date ? data.dob.toISOString() : data.dob
//         };
//       },

//       // Progress to next registration step
//       nextStep: () => {
//         set((state) => ({
//           data: {
//             ...state.data,
//             registration_step: Math.min(state.data.registration_step + 1, 4)
//           }
//         }));
//       },

//       // Reset store to initial state
//       reset: () => set({ data: initialState }),
//     }),
//     {
//       name: 'vendor-storage',
//       storage: createJSONStorage(() => AsyncStorage),
//       partialize: (state) => ({ data: state.data }),
//       version: 1, // Useful for migrations if store structure changes
//     }
//   )
// );

// // Helper hook for components
// export const useVendorData = (selector = (state) => state) => {
//   return useVendorStore(selector, shallow);
// };

// export default useVendorStore;
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { shallow } from 'zustand/shallow';

const initialState = {
  name: '',
  email: '',
  phone: '',
  dob: '',
  password: '',
  address: '',
  divisionKey: '',
  divisionValue: '',
  districtKey: '',
  districtValue: '',
  thanaKey: '',
  thanaValue: '',
  nid_number: '',
  technician_quantity: '1',
  nid_front: null,
  nid_back: null,
  selfie: null,
  otp_verified: false,
  registration_step: 1,
  
  // নতুন যুক্ত ফিল্ডসমূহ - সার্ভিস এরিয়া
  serviceDivisionKey: '',
  serviceDivisionValue: '',
  serviceDistrictKey: '',
  serviceDistrictValue: '',
  serviceThanas: [], // অ্যারে অফ অবজেক্টস: [{ key: 'value', value: 'name' }]
  
  // নতুন যুক্ত ফিল্ডসমূহ - ডকুমেন্ট আপলোড
  cvFile: null, // ফাইল অবজেক্ট: { name, uri, type, size }
  tradeLicenseFile: null, // ফাইল অবজেক্ট: { name, uri, type, size }
  
  // নতুন যুক্ত ফিল্ডসমূহ - বিজনেস ইনফরমেশন
  businessName: '',
  businessDescription: '',
  
  // নতুন যুক্ত ফিল্ডসমূহ - প্রেসেন্ট এড্রেস
  presentAddress: '',
  presentDivisionKey: '',
  presentDivisionValue: '',
  presentDistrictKey: '',
  presentDistrictValue: '',
  presentThanaKey: '',
  presentThanaValue: '',
  
  // নতুন যুক্ত ফিল্ডসমূহ - পারমানেন্ট এড্রেস
  permanentAddress: '',
  permanentDivisionKey: '',
  permanentDivisionValue: '',
  permanentDistrictKey: '',
  permanentDistrictValue: '',
  permanentThanaKey: '',
  permanentThanaValue: '',
  
  // নতুন যুক্ত ফিল্ডসমূহ - প্রোভাইডেড সার্ভিস
  providedServices: [], // অ্যারে অফ অবজেক্টস: [{ key: 'value', value: 'name' }]
};

const useVendorStore = create(
  persist(
    (set, get) => ({
      data: initialState,
      
      // Update store with new data
      update: (newData) => {
        set((state) => ({
          data: {
            ...state.data,
            ...newData,
          },
        }));
      },
      
      // Prepare complete data for submission
      prepareSubmissionData: () => {
        const { data } = get();
        return {
          ...data,
          // Add any transformations here
          dob: data.dob instanceof Date ? data.dob.toISOString() : data.dob
        };
      },
      
      // Progress to next registration step
      nextStep: () => {
        set((state) => ({
          data: {
            ...state.data,
            registration_step: Math.min(state.data.registration_step + 1, 4)
          }
        }));
      },
      
      // Reset store to initial state
      reset: () => set({ data: initialState }),
    }),
    {
      name: 'vendor-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ data: state.data }),
      version: 1, // Useful for migrations if store structure changes
    }
  )
);

// Helper hook for components
export const useVendorData = (selector = (state) => state) => {
  return useVendorStore(selector, shallow);
};

export default useVendorStore;