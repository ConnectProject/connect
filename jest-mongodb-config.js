module.exports = {
  mongodbMemoryServerOptions: {
    instance: {
      port: 46347,
    },
    binary: {
      version: '3.6.10',
      platform: 'linux',
      arch: 'x64',
      skipMD5: true
    },
    autoStart: false,
    debug: true
  }
};