<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Security Code — CMS Global</title>
  <style>
    body { margin: 0; padding: 0; background-color: #080d1a; font-family: 'Inter', Arial, sans-serif; }
    .wrapper { max-width: 500px; margin: 40px auto; background: #0f1629; border: 1px solid rgba(6,182,212,0.15); border-radius: 24px; overflow: hidden; }
    .header { background: #0c1a2e; padding: 40px; text-align: center; border-bottom: 1px solid rgba(6,182,212,0.1); }
    .logo { font-size: 20px; font-weight: 800; color: #22d3ee; letter-spacing: 0.3em; text-transform: uppercase; }
    .body { padding: 40px; text-align: center; }
    .greeting { color: #e2e8f0; font-size: 22px; font-weight: 700; margin-bottom: 12px; }
    .text { color: #94a3b8; font-size: 14px; line-height: 1.6; margin-bottom: 30px; }
    .otp-card {
      background: rgba(34, 211, 238, 0.05);
      border: 1px dashed rgba(34, 211, 238, 0.3);
      border-radius: 16px;
      padding: 30px;
      margin: 20px 0;
    }
    .otp-code {
      font-family: 'Courier New', monospace;
      font-size: 42px;
      font-weight: 800;
      color: #22d3ee;
      letter-spacing: 12px;
      margin: 0;
    }
    .expiry { color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 15px; }
    .footer { padding: 30px; text-align: center; background: #0c1a2e; border-top: 1px solid rgba(6,182,212,0.1); }
    .footer p { color: #475569; font-size: 11px; margin: 5px 0; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div class="logo">CMS GLOBAL</div>
    </div>
    <div class="body">
      <div class="greeting">Security Authentication</div>
      <p class="text">Hello {{ $userName }},<br/>Use the following 6-digit code to complete your password reset. This code is confidential.</p>
      
      <div class="otp-card">
        <h1 class="otp-code">{{ $otp }}</h1>
        <div class="expiry">Expires in 15 minutes</div>
      </div>

      <p class="text" style="font-size: 12px; margin-top: 30px;">
        If you did not request this code, please ignore this email or contact support if you suspect unauthorized activity.
      </p>
    </div>
    <div class="footer">
      <p>&copy; {{ date('Y') }} CMS Global — Secure Systems Division</p>
    </div>
  </div>
</body>
</html>
