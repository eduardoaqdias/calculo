const crypto = require('node:crypto');

function base64url(buf) {
    return buf.toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function base64urlDecode(str) {
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    while (str.length % 4) str += '=';
    return Buffer.from(str, 'base64').toString('utf8');
}

module.exports = async function (context, req) {
    const headers = { 'Content-Type': 'application/json' };

    if (req.method === 'GET') {
        context.res = { status: 200, headers, body: { status: 'online' } };
        return;
    }

    try {
        const { email, otp, token } = req.body || {};
        if (!email || !otp || !token) {
            context.res = { status: 400, headers, body: { sucesso: false, erro: 'Incompleto' } };
            return;
        }

        const parts = token.split('.');
        if (parts.length !== 3) throw new Error('JWT malformatado');

        const secret = process.env.OTP_JWT_SECRET || 'protege-secret-dev';
        const expectedSig = base64url(crypto.createHmac('sha256', secret).update(`${parts[0]}.${parts[1]}`).digest());

        if (parts[2] !== expectedSig) {
            context.res = { status: 401, headers, body: { sucesso: false, erro: 'Assinatura invalida' } };
            return;
        }

        const payload = JSON.parse(base64urlDecode(parts[1]));
        if (payload.exp && Math.floor(Date.now() / 1000) > payload.exp) {
            context.res = { status: 401, headers, body: { sucesso: false, erro: 'Token expirado' } };
            return;
        }

        if (payload.email !== email.toLowerCase().trim() || payload.otp !== String(otp).trim()) {
            context.res = { status: 401, headers, body: { sucesso: false, erro: 'Dados invalidos' } };
            return;
        }

        context.res = { status: 200, headers, body: { sucesso: true } };

    } catch (err) {
        context.log(`[VERIFY ERROR] ${err.message}`);
        context.res = { status: 500, headers, body: { sucesso: false, erro: 'Erro interno', details: err.message } };
    }
};
