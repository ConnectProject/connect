module.exports = {
  apps: [
    {
      name: 'connect',
      script: 'src/index.js',
      watch: '.',
      ignore_watch: ['node_modules', 'logs'],
      exp_backoff_restart_delay: 100,
      log_date_format: "YYYY-MM-DD HH:mm:ss.SSS",
    },
  ],
};
