import { Text, TextInput, View } from 'react-native';

export default function Input({ 
  label, 
  placeholder, 
  value, 
  onChangeText, 
  secureTextEntry = false, 
  keyboardType = 'default',
  rightIcon,
  leftIcon,
  error,
  className = "",
  inputClassName = "",
  labelClassName = "",
  errorClassName = "",
  ...props 
}) {
  return (
    <View className={`mb-4 ${className}`}>
      {label && (
        <Text className={`text-sm md:text-base font-medium mb-2 text-gray-700 ${labelClassName}`}>
          {label}
        </Text>
      )}
      
      <View className="relative">
        {leftIcon && (
          <View className="absolute left-3 top-3 z-10">
            {leftIcon}
          </View>
        )}
        
        <TextInput
          className={`
            border border-gray-300 rounded-lg 
            py-3 px-4 text-base md:text-lg
            ${rightIcon ? 'pr-10' : ''}
            ${leftIcon ? 'pl-10' : ''}
            ${error ? 'border-red-500' : ''}
            ${inputClassName}
          `}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          {...props}
        />
        
        {rightIcon && (
          <View className="absolute right-3 top-3">
            {rightIcon}
          </View>
        )}
      </View>

      {error && (
        <Text className={`text-red-500 text-xs mt-1 ${errorClassName}`}>
          {error}
        </Text>
      )}
    </View>
  );
}