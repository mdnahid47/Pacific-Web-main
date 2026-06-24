import { ActivityIndicator, Text, TouchableOpacity } from 'react-native';

export default function Button({ 
  title, 
  onPress, 
  disabled = false, 
  className = "",
  loading = false,
  variant = "primary" 
}) {
  // Variant colors
  const variantStyles = {
    primary: {
      bg: 'bg-olympic',
      disabledBg: 'bg-olympic',
      text: 'text-white'
    },
    secondary: {
      bg: 'bg-gray-200',
      disabledBg: 'bg-gray-300',
      text: 'text-gray-800'
    },
    danger: {
      bg: 'bg-red-500',
      disabledBg: 'bg-red-300',
      text: 'text-white'
    }
  };

  const currentVariant = variantStyles[variant] || variantStyles.primary;

  return (
    <TouchableOpacity
      className={`
        ${disabled || loading ? currentVariant.disabledBg : currentVariant.bg}
        py-3 px-6 rounded-lg items-center justify-center
        ${disabled || loading ? 'opacity-70' : 'opacity-100'}
        min-h-[50px] md:min-h-[56px]  // Responsive minimum touch target
        w-full max-w-md mx-auto       // Responsive width
        active:opacity-80             // Press effect
        ${className}
      `}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text className={`${currentVariant.text} font-medium text-base md:text-lg`}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}