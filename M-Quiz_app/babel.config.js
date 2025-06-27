// babel.config.js
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // --- ADD THIS LINE ---
    plugins: ['react-native-reanimated/plugin'],
  };
};