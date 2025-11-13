import * as ImagePicker from 'expo-image-picker';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function NIDUpload({ value, onChange }) {
  const pickImage = async (side) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      onChange({
        ...value,
        [side === 'front' ? 'frontImage' : 'backImage']: result.assets[0].uri
      });
    }
  };

  return (
    <View className="mb-5">
      <Text className="text-base mb-2.5">NID Upload</Text>
      
      <View className="flex-row justify-between">
        <TouchableOpacity
          className="w-[48%] h-30 border border-gray-200 justify-center items-center rounded-lg overflow-hidden"
          onPress={() => pickImage('front')}
        >
          {value.frontImage ? (
            <Image source={{ uri: value.frontImage }} className="w-full h-full" resizeMode="cover" />
          ) : (
            <Text className="text-gray-500">Front Side</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          className="w-[48%] h-30 border border-gray-200 justify-center items-center rounded-lg overflow-hidden"
          onPress={() => pickImage('back')}
        >
          {value.backImage ? (
            <Image source={{ uri: value.backImage }} className="w-full h-full" resizeMode="cover" />
          ) : (
            <Text className="text-gray-500">Back Side (Optional)</Text>
          )}
        </TouchableOpacity>
      </View>

      <TextInput
        placeholder="NID Number"
        value={value.number}
        onChangeText={(text) => onChange({ ...value, number: text })}
        className="mt-2.5 border border-gray-200 p-2.5 rounded"
        placeholderTextColor="#888"
      />
    </View>
  );
}