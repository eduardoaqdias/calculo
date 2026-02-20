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

const jwt = require('jsonwebtoken');

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
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Preflight CORS
    if (req.method === 'OPTIONS') {
        context.res = { status: 204, headers, body: '' };
        return;
    }

    try {
        const { email, otp, token } = req.body || {};

        // Validação de campos obrigatórios
        if (!email || !otp || !token) {
            context.res = {
                status: 400, headers,
                body: JSON.stringify({ sucesso: false, erro: 'Campos obrigatórios ausentes.' }),
            };
            return;
        }

        // Sanitização básica
        const emailLimpo = String(email).trim().toLowerCase();
        const otpLimpo = String(otp).trim().replace(/\D/g, '');
        const tokenLimpo = String(token).trim();

        // Valida OTP (deve ser 6 dígitos)
        if (otpLimpo.length !== 6) {
            context.res = {
                status: 400, headers,
                body: JSON.stringify({ sucesso: false, erro: 'Código inválido. Digite os 6 dígitos.' }),
            };
            return;
        }

        // Verifica e decodifica o JWT
        const segredo = process.env.OTP_JWT_SECRET || 'protege-otp-secret-inseguro-dev';
        let payload;
        try {
            payload = jwt.verify(tokenLimpo, segredo);
        } catch (jwtErr) {
            // Token expirado ou inválido
            const mensagem = jwtErr.name === 'TokenExpiredError'
                ? 'Código expirado. Solicite um novo código.'
                : 'Token inválido. Solicite um novo código.';
            context.res = {
                status: 401, headers,
                body: JSON.stringify({ sucesso: false, erro: mensagem }),
            };
            return;
        }

        // Verifica se o e-mail do token bate com o e-mail informado
        if (!compararSeguro(payload.email, emailLimpo)) {
            context.res = {
                status: 403, headers,
                body: JSON.stringify({ sucesso: false, erro: 'Token não corresponde ao e-mail informado.' }),
            };
            return;
        }

        // Verifica o OTP com timing-safe comparison
        if (!compararSeguro(payload.otp, otpLimpo)) {
            context.log.warn(`[verify-otp] OTP incorreto para ${emailLimpo.replace(/(.{2}).*(@.*)/, '$1***$2')}`);
            context.res = {
                status: 401, headers,
                body: JSON.stringify({ sucesso: false, erro: 'Código incorreto. Verifique e tente novamente.' }),
            };
            return;
        }

        // 🎉 OTP válido!
        context.log(`[2FA] Verificação bem-sucedida para ${emailLimpo.replace(/(.{2}).*(@.*)/, '$1***$2')}`);

        context.res = {
            status: 200, headers,
            body: JSON.stringify({ sucesso: true }),
        };

    } catch (err) {
        context.log.error('[verify-otp] Erro:', err.message);
        context.res = {
            status: 500, headers,
            body: JSON.stringify({ sucesso: false, erro: 'Erro interno. Tente novamente.' }),
        };
    }
};
