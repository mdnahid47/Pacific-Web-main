const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
config.resolver.sourceExts.push('mjs');


try {
 
  const { withNativeWind } = require('nativewind/metro');
  
  module.exports = withNativeWind(config, {
    input: './src/styles/global.css', 
    
  });
  
  console.log(' NativeWind loaded successfully');
} catch (error) {
  console.log(' NativeWind not available:', error.message);
  module.exports = config;
}