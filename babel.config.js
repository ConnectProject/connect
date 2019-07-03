module.exports = function(api) {
  const presets = [
    ['@babel/preset-env', { useBuiltIns: 'entry', corejs: '3.0.0' }],
    '@babel/preset-react',
  ];

  const plugins = ['@babel/plugin-proposal-class-properties'];

  api.cache.never();

  return {
    presets,
    plugins,
    env: {
      development: {
        compact: true,
      },
    },
  };
};
