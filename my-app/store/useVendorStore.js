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
  
  // new add field service area
  serviceDivisionKey: '',
  serviceDivisionValue: '',
  serviceDistrictKey: '',
  serviceDistrictValue: '',
  serviceThanas: [], // array of objects: [{ key: 'value', value: 'name' }]
  
  // new add feild document upload
  cvFile: null, // file object: { name, uri, type, size }
  tradeLicenseFile: null, // file object: { name, uri, type, size }
  
  // new add feild business information
  businessName: '',
  businessDescription: '',
  
  // new add feild present address
  presentAddress: '',
  presentDivisionKey: '',
  presentDivisionValue: '',
  presentDistrictKey: '',
  presentDistrictValue: '',
  presentThanaKey: '',
  presentThanaValue: '',
  
  // new add feild permanent address
  permanentAddress: '',
  permanentDivisionKey: '',
  permanentDivisionValue: '',
  permanentDistrictKey: '',
  permanentDistrictValue: '',
  permanentThanaKey: '',
  permanentThanaValue: '',
  
  // new add feild provided services
  providedServices: [], // array of objects: [{ key: 'value', value: 'name' }]
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