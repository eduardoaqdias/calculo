/**
 * Azure Function: verify-otp
 * POST /api/verify-otp
 *
 * Recebe: { email: string, otp: string, token: string }
 * Verifica: assinatura JWT + OTP dentro do token + expiração
 * Retorna: { sucesso: true } ou { sucesso: false, erro: "..." }
 *
 * Fluxo stateless — sem banco de dados necessário.
 * O OTP está assinado criptograficamente no token JWT.
 */

const crypto = require('crypto');

function base64url(str) {
    return Buffer.from(str).toString('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
}

function base64urlDecode(str) {
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    while (str.length % 4) str += '=';
    return Buffer.from(str, 'base64').toString('utf8');
}

function verificarToken(token, segredo) {
    const parts = token.split('.');
    if (parts.length !== 3) {
        const err = new Error('Formato inválido.');
        err.name = 'JsonWebTokenError';
        throw err;
    }

    const [h, p, sig] = parts;
    const expectedSig = base64url(crypto.createHmac('sha256', segredo).update(`${h}.${p}`).digest());

    if (sig !== expectedSig) {
        const err = new Error('Assinatura inválida.');
        err.name = 'JsonWebTokenError';
        throw err;
    }

    const payload = JSON.parse(base64urlDecode(p));
    if (payload.exp && Math.floor(Date.now() / 1000) > payload.exp) {
        const err = new Error('Experirado.');
        err.name = 'TokenExpiredError';
        throw err;
    }

    return payload;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Compara strings de forma timing-safe para evitar timing attacks */
function compararSeguro(a, b) {
    if (typeof a !== 'string' || typeof b !== 'string') return false;
    if (a.length !== b.length) return false;
    let resultado = 0;
    for (let i = 0; i < a.length; i++) {
        resultado |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    return resultado === 0;
}

// ─── Handler principal ────────────────────────────────────────────────────────
module.exports = async function (context, req) {
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (req.method === 'OPTIONS') {
        context.res = { status: 204, headers, body: '' };
        return;
    }

    if (req.method === 'GET') {
        context.res = { status: 200, headers, body: JSON.stringify({ mensagem: 'API verify-otp online.' }) };
        return;
    }

    try {
        const { email, otp, token } = req.body || {};

        if (!email || !otp || !token) {
            context.res = { status: 400, headers, body: JSON.stringify({ sucesso: false, erro: 'Campos ausentes.' }) };
            return;
        }

        const emailLimpo = String(email).trim().toLowerCase();
        const otpLimpo = String(otp).trim().replace(/\D/g, '');
        const tokenLimpo = String(token).trim();

        if (otpLimpo.length !== 6) {
            context.res = { status: 400, headers, body: JSON.stringify({ sucesso: false, erro: 'Código inválido.' }) };
            return;
        }

        const segredo = process.env.OTP_JWT_SECRET || 'protege-otp-secret-inseguro-dev';
        let payload;
        try {
            payload = verificarToken(tokenLimpo, segredo);
        } catch (jwtErr) {
            const msg = jwtErr.name === 'TokenExpiredError' ? 'Código expirado.' : 'Token inválido.';
            context.res = { status: 401, headers, body: JSON.stringify({ sucesso: false, erro: msg }) };
            return;
        }

        if (!compararSeguro(payload.email, emailLimpo)) {
            context.res = { status: 403, headers, body: JSON.stringify({ sucesso: false, erro: 'E-mail divergente.' }) };
            return;
        }

        if (!compararSeguro(payload.otp, otpLimpo)) {
            context.log(`[AUTH FAIL] ${emailLimpo}`);
            context.res = { status: 401, headers, body: JSON.stringify({ sucesso: false, erro: 'Código incorreto.' }) };
            return;
        }

        context.log(`[AUTH OK] ${emailLimpo}`);
        context.res = { status: 200, headers, body: JSON.stringify({ sucesso: true }) };

    } catch (err) {
        context.log(`[FATAL] verify-otp: ${err.message}`);
        context.res = { status: 500, headers, body: JSON.stringify({ sucesso: false, erro: 'Erro interno.' }) };
    }
};
