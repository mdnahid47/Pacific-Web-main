const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

config.resolver.sourceExts.push('mjs');


if (process.env.EXPO_PLATFORM === 'web') {
  config.transformer.babelTransformerPath = require.resolve('metro-react-native-babel-transformer');
  config.resolver.assetExts.push('cjs');
}

module.exports = withNativeWind(config, {
  input: './global.css', // TailwindCSS config file path
});