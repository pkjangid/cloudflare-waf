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
      
      // OAuth configuration - REPLACE WITH YOUR ACTUAL CLIENT ID
      const clientId = isProduction 
        ? '1086410106752-gamj7j28s3omervrr46ag3org678fqb3.apps.googleusercontent.com '  // Replace with your Client ID
        : '1086410106752-gamj7j28s3omervrr46ag3org678fqb3.apps.googleusercontent.com '; // Same for demo, different for real project
      
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
      
      return new Response(`
        <html>
          <head>
            <title>OAuth Callback Success</title>
            <style>
              body { font-family: Arial; margin: 40px; background: #f5f5f5; }
              .container { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
              .success { color: #4CAF50; }
              .code { background: #f0f0f0; padding: 10px; border-radius: 4px; margin: 10px 0; word-break: break-all; }
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
              <p><em>In a real application, this request would be forwarded to your backend server to exchange the code for an access token.</em></p>
              <p><a href="/login">🔄 Try Login Again</a></p>
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
            </style>
          </head>
          <body>
            <div class="container">
              <h1>🚀 OAuth Demo</h1>
              <p><strong>Current Domain:</strong> ${hostname}</p>
              
              <div class="info">
                <h3>How it works:</h3>
                <ol>
                  <li>Click "Login with Google" below</li>
                  <li>You'll be redirected to Google OAuth</li>
                  <li>After authentication, you'll return to /auth/callback</li>
                  <li>In production, callback would go to your backend</li>
                </ol>
              </div>
              
              <a href="/login" class="btn">🔐 Login with Google</a>
              
              <h3>Test URLs:</h3>
              <ul>
                <li><a href="https://mvp.yourcodemate.in/login">Production Login</a></li>
                <li><a href="https://mvp-dev.yourcodemate.in/login">Development Login</a></li>
              </ul>
            </div>
          </body>
        </html>
      `, {
        headers: { 'Content-Type': 'text/html' }
      });
    }
    
    // For all other requests, return 404
    return new Response('Page not found', { status: 404 });
  }
}
