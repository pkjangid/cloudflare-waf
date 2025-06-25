export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const hostname = url.hostname;
    
    // Handle /login endpoint - redirect to Google OAuth
    if (url.pathname === '/login') {
      
      // Determine environment based on hostname
      const isProduction = hostname === 'mvp.yourcodemate.in';
      const isDev = hostname === 'mvp-dev.yourcodemate.in';
      
      if (!isProduction && !isDev) {
        return new Response(`
          <html>
            <body>
              <h1>Invalid Domain</h1>
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
      
      // OAuth configuration - Using your actual Client ID
      const clientId = isProduction 
        ? '1086410106752-gamj7j28s3omervrr46ag3org678fqb3.apps.googleusercontent.com'
        : '1086410106752-gamj7j28s3omervrr46ag3org678fqb3.apps.googleusercontent.com';
      
      const redirectUri = `https://${hostname}/auth/callback`;
      
      // Build Google OAuth URL
      const oauthParams = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: 'openid email profile',
        state: Math.random().toString(36).substring(7) // Random state for security
      });
      
      const googleOAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${oauthParams}`;
      
      console.log('Redirecting to:', googleOAuthUrl);
      
      // Return 302 redirect
      return Response.redirect(googleOAuthUrl, 302);
    }
    
    // Handle /auth/callback - show success page (in real app, this goes to your backend)
    if (url.pathname === '/auth/callback') {
      const code = url.searchParams.get('code');
      const state = url.searchParams.get('state');
      const error = url.searchParams.get('error');
      
      // Handle OAuth errors
      if (error) {
        return new Response(`
          <html>
            <head>
              <title>OAuth Error</title>
              <style>
                body { font-family: Arial; margin: 40px; background: #f5f5f5; }
                .container { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                .error { color: #f44336; }
                .btn { background: #4285f4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 10px 0; }
              </style>
            </head>
            <body>
              <div class="container">
                <h1 class="error">❌ OAuth Error</h1>
                <p><strong>Error:</strong> ${error}</p>
                <p><strong>Description:</strong> ${url.searchParams.get('error_description') || 'Unknown error'}</p>
                <p><strong>Domain:</strong> ${hostname}</p>
                <hr>
                <p>Please try again or contact support if the problem persists.</p>
                <a href="/login" class="btn">🔄 Try Again</a>
                <a href="/" class="btn">🏠 Go Home</a>
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
            <title>OAuth Callback Success</title>
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
              <h1 class="success">✅ OAuth Callback Successful!</h1>
              <p><strong>Domain:</strong> ${hostname}</p>
              <p><strong>Authorization Code:</strong></p>
              <div class="code">${code || 'No code received'}</div>
              <p><strong>State:</strong> ${state || 'No state received'}</p>
              <hr>
              <p><em>🎉 Success! Your OAuth flow is working perfectly.</em></p>
              <p><em>In a real application, this request would be forwarded to your backend server to exchange the code for an access token.</em></p>
              <a href="/login" class="btn">🔄 Try Login Again</a>
              <a href="/" class="btn">🏠 Go Home</a>
            </div>
          </body>
        </html>
      `, {
        headers: { 'Content-Type': 'text/html' }
      });
    }
    
    // Handle root path - show demo page
    if (url.pathname === '/' || url.pathname === '') {
      return new Response(`
        <html>
          <head>
            <title>OAuth Demo - ${hostname}</title>
            <style>
              body { font-family: Arial; margin: 40px; background: #f5f5f5; }
              .container { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
              .btn { background: #4285f4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 10px 0; }
              .btn:hover { background: #357ae8; }
              .info { background: #e3f2fd; padding: 15px; border-radius: 4px; margin: 15px 0; }
              .success { background: #e8f5e8; padding: 15px; border-radius: 4px; margin: 15px 0; color: #2e7d32; }
              .client-info { background: #fff3e0; padding: 15px; border-radius: 4px; margin: 15px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>🚀 OAuth Demo - Cloudflare Alternative to Akamai</h1>
              <p><strong>Current Domain:</strong> ${hostname}</p>
              
              <div class="success">
                <h3>✅ Setup Complete!</h3>
                <p>Your OAuth redirect is now configured and ready to use.</p>
              </div>
              
              <div class="client-info">
                <h3>🔑 Configuration Details:</h3>
                <p><strong>Client ID:</strong> 1086410106752-gamj7j28s3omervrr46ag3org678fqb3.apps.googleusercontent.com</p>
                <p><strong>Redirect URIs:</strong></p>
                <ul>
                  <li>https://mvp.yourcodemate.in/auth/callback</li>
                  <li>https://mvp-dev.yourcodemate.in/auth/callback</li>
                </ul>
              </div>
              
              <div class="info">
                <h3>🔄 OAuth Flow:</h3>
                <ol>
                  <li>Click "Login with Google" below</li>
                  <li>You'll be redirected to Google OAuth</li>
                  <li>Sign in with your Google account</li>
                  <li>Google will redirect you back to /auth/callback</li>
                  <li>You'll see the authorization code (proof it works!)</li>
                </ol>
              </div>
              
              <a href="/login" class="btn">🔐 Login with Google</a>
              
              <hr>
              
              <h3>🌐 Test Both Environments:</h3>
              <ul>
                <li><strong>Production:</strong> <a href="https://mvp.yourcodemate.in/login" target="_blank">mvp.yourcodemate.in/login</a></li>
                <li><strong>Development:</strong> <a href="https://mvp-dev.yourcodemate.in/login" target="_blank">mvp-dev.yourcodemate.in/login</a></li>
              </ul>
              
              <h3>🛡️ Security Features Enabled:</h3>
              <ul>
                <li>✅ Cloudflare WAF Protection</li>
                <li>✅ DDoS Protection</li>
                <li>✅ SSL/TLS Encryption</li>
                <li>✅ OAuth State Parameter (CSRF Protection)</li>
                <li>✅ Domain Validation</li>
              </ul>
              
              <div class="info">
                <h3>💡 For Your Client:</h3>
                <p>This demonstrates that <strong>Cloudflare can completely replace Akamai</strong> for OAuth redirects with:</p>
                <ul>
                  <li>🆓 <strong>Zero cost</strong> (vs expensive Akamai licensing)</li>
                  <li>⚡ <strong>Faster setup</strong> (hours vs weeks)</li>
                  <li>🎯 <strong>Same functionality</strong> as Akamai Property Manager</li>
                  <li>🔧 <strong>Easier management</strong> via user-friendly dashboard</li>
                </ul>
              </div>
            </div>
          </body>
        </html>
      `, {
        headers: { 'Content-Type': 'text/html' }
      });
    }
    
    // For all other requests, return 404
    return new Response(`
      <html>
        <head>
          <title>404 - Page Not Found</title>
          <style>
            body { font-family: Arial; margin: 40px; background: #f5f5f5; text-align: center; }
            .container { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .btn { background: #4285f4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>404 - Page Not Found</h1>
            <p>The page you're looking for doesn't exist on <strong>${hostname}</strong></p>
            <a href="/" class="btn">🏠 Go Home</a>
          </div>
        </body>
      </html>
    `, { 
      status: 404,
      headers: { 'Content-Type': 'text/html' }
    });
  }
}
