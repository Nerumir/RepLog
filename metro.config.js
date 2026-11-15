const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

const { transformer, resolver } = config;

config.transformer = {
  ...transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer'),
};

config.resolver = {
  ...resolver,
  assetExts: [...resolver.assetExts.filter((ext) => ext !== 'svg'), 'wasm'],
  sourceExts: [...resolver.sourceExts, 'svg', 'sql'],
};

module.exports = config;
