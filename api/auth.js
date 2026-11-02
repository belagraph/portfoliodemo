// Sends the admin to GitHub to log in
const crypto = require('crypto');

module.exports = (req, res) => {
  const params = new URLSearchParams({
    client_id: process.env.OAUTH_GITHUB_CLIENT_ID,
    scope: 'repo,user',
    state: crypto.randomBytes(8).toString('hex'),
  });
  res.statusCode = 302;
  res.setHeader('Location', 'https://github.com/login/oauth/authorize?' + params);
  res.end();
};
