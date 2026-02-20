const crypto = require('node:crypto');

function base64url(buf) {
  return buf.toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

module.exports = async function (context, req) {
  const headers = { 'Content-Type': 'application/json' };

  if (req.method === 'GET') {
    context.res = { status: 200, headers, body: { status: 'online', version: '2.1' } };
    return;
  }

  if (req.method === 'OPTIONS') {
    context.res = { status: 204, headers, body: '' };
    return;
  }

  try {
    const { email } = req.body || {};
    if (!email) {
      context.res = { status: 400, headers, body: { sucesso: false, erro: 'Email obrigatorio' } };
      return;
    }

    const emailLimpo = String(email).trim().toLowerCase();
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const secret = process.env.OTP_JWT_SECRET || 'protege-secret-dev';

    const h = base64url(Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })));
    const p = base64url(Buffer.from(JSON.stringify({ email: emailLimpo, otp, exp: Math.floor(Date.now() / 1000) + 300 })));
    const sig = base64url(crypto.createHmac('sha256', secret).update(`${h}.${p}`).digest());

    const token = `${h}.${p}.${sig}`;

    context.log(`[AUTH] Login iniciado para ${emailLimpo}`);

    context.res = {
      status: 200,
      headers,
      body: {
        sucesso: true,
        token,
        otp,
        debug: 'Ambiente Corporativo Protege'
      }
    };
  } catch (err) {
    context.log(`[CRITICAL] Error: ${err.message}`);
    context.res = {
      status: 500,
      headers,
      body: { sucesso: false, erro: 'Falha interna', details: err.message }
    };
  }
};
