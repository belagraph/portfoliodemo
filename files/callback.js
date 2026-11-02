// GitHub returns here after login; we swap the code for a token and hand it to the CMS popup
module.exports = async (req, res) => {
  let status, payload;
  try {
    const r = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        client_id: process.env.OAUTH_GITHUB_CLIENT_ID,
        client_secret: process.env.OAUTH_GITHUB_CLIENT_SECRET,
        code: req.query.code,
      }),
    });
    const data = await r.json();
    if (!data.access_token) throw new Error(data.error_description || 'No token returned');
    status = 'success';
    payload = { token: data.access_token, provider: 'github' };
  } catch (e) {
    status = 'error';
    payload = { message: e.message };
  }
  const msg = JSON.stringify('authorization:github:' + status + ':' + JSON.stringify(payload));
  res.setHeader('Content-Type', 'text/html');
  res.end(`<!doctype html><script>
(function () {
  function receive(e) {
    window.opener.postMessage(${msg}, e.origin);
    window.removeEventListener('message', receive, false);
  }
  window.addEventListener('message', receive, false);
  window.opener.postMessage('authorizing:github', '*');
})();
</script>`);
};
