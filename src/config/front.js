module.exports = `
  window._env_ = {
    "PUBLIC_URL": "${process.env.PUBLIC_URL || ''}",
    "PARSE_APP_ID": "${process.env.PARSE_APP_ID || ''}",
    "PARSE_JAVASCRIPT_KEY": "${process.env.PARSE_JAVASCRIPT_KEY || ''}",
    "GITHUB_CLIENT_ID": "${process.env.GITHUB_CLIENT_ID}",
  }
`;
