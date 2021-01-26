module.exports = `
  window._env_ = {
    "PUBLIC_URL": "${process.env.PUBLIC_URL || ''}",
    "API_URL": "${process.env.API_URL}",
    "GITHUB_CLIENT_ID": "${process.env.GITHUB_CLIENT_ID}",
  }
`;
