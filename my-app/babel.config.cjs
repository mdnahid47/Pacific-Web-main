module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    plugins: [
      ['module:react-native-dotenv', {
        moduleName: '@env',
        path: '.env',
        allowUndefined: true,
      }],
      'react-native-worklets-core/plugin',
      'react-native-reanimated/plugin', 
      '@babel/plugin-transform-modules-commonjs',
    ],
  };
};