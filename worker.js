export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const hostname = url.hostname;

    // Handle /login endpoint - redirect to Google OAuth
    if (url.pathname === '/login') {
      const isProduction = hostname === 'mvp.yourcodemate.in';
      const isDev = hostname === 'mvp-dev.yourcodemate.in';

      if (!isProduction && !isDev) {
        return new Response(`
          <html>
            <head>
              <meta charset="UTF-8">
              <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
            </head>
            <body>
              <h1><i class="fas fa-exclamation-triangle"></i> Invalid Domain</h1>
              <p>This service only works on:</p>
              <ul>
                <li>mvp.yourcodemate.in</li>
                <li>mvp-dev.yourcodemate.in</li>
              </ul>
              <p>Current domain: ${hostname}</p>
            </body>
          </html>
        `, {
          status: 400,
          headers: { 'Content-Type': 'text/html' }
        });
      }

      const clientId = '1086410106752-gamj7j28s3omervrr46ag3org678fqb3.apps.googleusercontent.com';
      const redirectUri = `https://${hostname}/auth/callback`;

      const oauthParams = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: 'openid email profile',
        state: Math.random().toString(36).substring(7)
      });

      const googleOAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${oauthParams}`;
      return Response.redirect(googleOAuthUrl, 302);
    }

    // Handle /auth/callback
    if (url.pathname === '/auth/callback') {
      const code = url.searchParams.get('code');
      const state = url.searchParams.get('state');
      const error = url.searchParams.get('error');

      if (error) {
        return new Response(`
          <html>
            <head>
              <meta charset="UTF-8">
              <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
              <style>
                body { font-family: Arial; margin: 40px; background: #f5f5f5; }
                .container { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                .error { color: #f44336; }
                .btn { background: #4285f4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 10px 0; }
              </style>
            </head>
            <body>
              <div class="container">
                <h1 class="error"><i class="fas fa-times-circle"></i> OAuth Error</h1>
                <p><strong>Error:</strong> ${error}</p>
                <p><strong>Description:</strong> ${url.searchParams.get('error_description') || 'Unknown error'}</p>
                <p><strong>Domain:</strong> ${hostname}</p>
                <hr>
                <p>Please try again or contact support if the problem persists.</p>
                <a href="/login" class="btn"><i class="fas fa-redo"></i> Try Again</a>
                <a href="/" class="btn"><i class="fas fa-home"></i> Go Home</a>
              </div>
            </body>
          </html>
        `, {
          headers: { 'Content-Type': 'text/html' }
        });
      }

      return new Response(`
        <html>
          <head>
            <meta charset="UTF-8">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
            <style>
              body { font-family: Arial; margin: 40px; background: #f5f5f5; }
              .container { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
              .success { color: #4CAF50; }
              .code { background: #f0f0f0; padding: 10px; border-radius: 4px; margin: 10px 0; word-break: break-all; font-family: monospace; }
              .btn { background: #4285f4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 10px 5px; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1 class="success"><i class="fas fa-check-circle"></i> OAuth Callback Successful!</h1>
              <p><strong>Domain:</strong> ${hostname}</p>
              <p><strong>Authorization Code:</strong></p>
              <div class="code">${code || 'No code received'}</div>
              <p><strong>State:</strong> ${state || 'No state received'}</p>
              <hr>
              <p><em>Success! Your OAuth flow is working perfectly.</em></p>
              <p><em>In a real application, this request would be forwarded to your backend server to exchange the code for an access token.</em></p>
              <a href="/login" class="btn"><i class="fas fa-sign-in-alt"></i> Try Login Again</a>
              <a href="/" class="btn"><i class="fas fa-home"></i> Go Home</a>
            </div>
          </body>
        </html>
      `, {
        headers: { 'Content-Type': 'text/html' }
      });
    }

    // Handle root path - demo landing page
    if (url.pathname === '/' || url.pathname === '') {
      return new Response(`
        <html>
          <head>
            <meta charset="UTF-8">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
            <title>OAuth Demo - ${hostname}</title>
            <style>
              body { font-family: Arial; margin: 40px; background: #f5f5f5; }
              .container { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
              .btn { background: #4285f4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 10px 0; }
              .btn:hover { background: #357ae8; }
              .info, .success, .client-info { padding: 15px; border-radius: 4px; margin: 15px 0; }
              .info { background: #e3f2fd; }
              .success { background: #e8f5e8; color: #2e7d32; }
              .client-info { background: #fff3e0; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1><i class="fas fa-rocket"></i> OAuth Demo - Cloudflare Alternative to Akamai</h1>
              <p><strong>Current Domain:</strong> ${hostname}</p>

              <div class="success">
                <h3><i class="fas fa-check-circle"></i> Setup Complete!</h3>
                <p>Your OAuth redirect is now configured and ready to use.</p>
              </div>

              <div class="client-info">
                <h3><i class="fas fa-key"></i> Configuration Details:</h3>
                <p><strong>Client ID:</strong> 1086410106752-gamj7j28s3omervrr46ag3org678fqb3.apps.googleusercontent.com</p>
                <p><strong>Redirect URIs:</strong></p>
                <ul>
                  <li>https://mvp.yourcodemate.in/auth/callback</li>
                  <li>https://mvp-dev.yourcodemate.in/auth/callback</li>
                </ul>
              </div>

              <div class="info">
                <h3><i class="fas fa-sync-alt"></i> OAuth Flow:</h3>
                <ol>
                  <li>Click "Login with Google" below</li>
                  <li>You’ll be redirected to Google OAuth</li>
                  <li>Sign in with your Google account</li>
                  <li>Google redirects to /auth/callback</li>
                  <li>You'll see the authorization code</li>
                </ol>
              </div>

              <a href="/login" class="btn"><i class="fas fa-lock"></i> Login with Google</a>

              <hr>

              <h3><i class="fas fa-globe"></i> Test Both Environments:</h3>
              <ul>
                <li><strong>Production:</strong> <a href="https://mvp.yourcodemate.in/login" target="_blank">mvp.yourcodemate.in/login</a></li>
                <li><strong>Development:</strong> <a href="https://mvp-dev.yourcodemate.in/login" target="_blank">mvp-dev.yourcodemate.in/login</a></li>
              </ul>

              <h3><i class="fas fa-shield-alt"></i> Security Features Enabled:</h3>
              <ul>
                <li><i class="fas fa-check-circle"></i> Cloudflare WAF Protection</li>
                <li><i class="fas fa-check-circle"></i> DDoS Protection</li>
                <li><i class="fas fa-check-circle"></i> SSL/TLS Encryption</li>
                <li><i class="fas fa-check-circle"></i> OAuth State Parameter</li>
                <li><i class="fas fa-check-circle"></i> Domain Validation</li>
              </ul>

              
            </div>
          </body>
        </html>
      `, {
        headers: { 'Content-Type': 'text/html' }
      });
    }

    // 404 for any other routes
    return new Response(`
      <html>
        <head>
          <meta charset="UTF-8">
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
          <style>
            body { font-family: Arial; margin: 40px; background: #f5f5f5; text-align: center; }
            .container { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .btn { background: #4285f4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1><i class="fas fa-exclamation-circle"></i> 404 - Page Not Found</h1>
            <p>The page you're looking for doesn't exist on <strong>${hostname}</strong></p>
            <a href="/" class="btn"><i class="fas fa-home"></i> Go Home</a>
          </div>
        </body>
      </html>
    `, {
      status: 404,
      headers: { 'Content-Type': 'text/html' }
    });
  }
}
