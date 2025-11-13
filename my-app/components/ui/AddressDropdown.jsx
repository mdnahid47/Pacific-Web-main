import { Text, View } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import tw from 'twrnc';

export const AddressDropdown = ({
  label,
  data,
  onSelect,
  placeholder,
  defaultOption,
  disabled = false,
}) => {
  return (
    <View style={tw`mb-4`}>
      <Text style={tw`text-base text-gray-700 mb-1`}>{label}</Text>
      <SelectList
        setSelected={onSelect}
        data={data}
        defaultOption={defaultOption} // Ensure this is a key (string)
        placeholder={placeholder}
        search={true} // Enable search
        disabled={disabled}
        boxStyles={tw`border border-gray-300 rounded-lg px-4 py-3`}
        inputStyles={tw`text-base text-black`} // Ensure input text is black
        dropdownStyles={tw`border border-gray-300 rounded-lg mt-1`}
        // Add search styling props
        searchPlaceholder="Search..." // Placeholder text for search
        searchPlaceholderTextColor="#999" // Placeholder text color
        searchInputStyle={tw`text-black`} // Search input text color
      />
    </View>
  );
};