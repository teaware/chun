const withPlugins = require("next-compose-plugins");
const withTM = require("next-transpile-modules")([
  "three",
  "@react-three/drei",
  "react-spring/three",
]);

module.exports = withPlugins([withTM], {
  webpack: (config) => {
    config.module.rules.push({
      test: /react-spring/,
      sideEffects: true,
    });

    return config;
  },
});
