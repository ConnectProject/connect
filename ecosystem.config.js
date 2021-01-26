module.exports = {
  apps: [
    {
      name: 'connect',
      script: 'src/index.js',
      watch: '.',
    },
    {
      name: 'connect-sandbox',
      script: 'src/sandbox.js',
      watch: '.',
    },
  ],
};
