module.exports = {
  apps: [
    {
      name: 'connect',
      script: 'src/index.js',
      watch: '.',
      ignore_watch : ["node_modules", "logs"],
    },
    {
      name: 'connect-sandbox',
      script: 'src/sandbox.js',
      watch: '.',
      ignore_watch : ["node_modules", "logs"],
    },
  ],
};
