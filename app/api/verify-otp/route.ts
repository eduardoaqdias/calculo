import { NextResponse } from 'next/server';
import crypto from 'node:crypto';

function base64url(str: string | Buffer) {
    const buf = typeof str === 'string' ? Buffer.from(str) : str;
    return buf.toString('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
}

function base64urlDecode(str: string) {
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    while (str.length % 4) str += '=';
    return Buffer.from(str, 'base64').toString('utf8');
}

function verificarToken(token: string, segredo: string) {
    const parts = token.split('.');
    if (parts.length !== 3) {
        const err = new Error('Formato inválido.');
        err.name = 'JsonWebTokenError';
        throw err;
    }

    const [h, p, sig] = parts;

    try {
        const hmac = crypto.createHmac('sha256', segredo);
        const expectedSig = base64url(hmac.update(`${h}.${p}`).digest());

        if (sig !== expectedSig) {
            const err = new Error('Assinatura inválida.');
            err.name = 'JsonWebTokenError';
            throw err;
        }
    } catch (e: any) {
        if (e.name === 'JsonWebTokenError') throw e;
        console.error('[JWT] Erro na verificação:', e.message);
        throw new Error('Falha técnica na verificação');
    }

    const payload = JSON.parse(base64urlDecode(p));
    if (payload.exp && Math.floor(Date.now() / 1000) > payload.exp) {
        const err = new Error('Expirado.');
        err.name = 'TokenExpiredError';
        throw err;
    }

    return payload;
}

function compararSeguro(a: string, b: string) {
    if (typeof a !== 'string' || typeof b !== 'string') return false;
    if (a.length !== b.length) return false;
    let resultado = 0;
    for (let i = 0; i < a.length; i++) {
        resultado |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    return resultado === 0;
}

export async function POST(req: Request) {
    try {
        const { email, otp, token } = await req.json();

        if (!email || !otp || !token) {
            return NextResponse.json({ sucesso: false, erro: 'Campos ausentes.' }, { status: 400 });
        }

        const emailLimpo = String(email).trim().toLowerCase();
        const otpLimpo = String(otp).trim().replace(/\D/g, '');
        const tokenLimpo = String(token).trim();

        if (otpLimpo.length !== 6) {
            return NextResponse.json({ sucesso: false, erro: 'Código inválido.' }, { status: 400 });
        }

        const segredo = process.env.OTP_JWT_SECRET || 'protege-otp-secret-inseguro-dev';
        let payload;
        try {
            payload = verificarToken(tokenLimpo, segredo);
        } catch (jwtErr: any) {
            const msg = jwtErr.name === 'TokenExpiredError' ? 'Código expirado.' : 'Token inválido.';
            return NextResponse.json({ sucesso: false, erro: msg }, { status: 401 });
        }

        if (!compararSeguro(payload.email, emailLimpo)) {
            return NextResponse.json({ sucesso: false, erro: 'E-mail divergente.' }, { status: 403 });
        }

        if (!compararSeguro(payload.otp, otpLimpo)) {
            console.log(`[AUTH FAIL] ${emailLimpo}`);
            return NextResponse.json({ sucesso: false, erro: 'Código incorreto.' }, { status: 401 });
        }

        console.log(`[AUTH OK] ${emailLimpo}`);
        return NextResponse.json({ sucesso: true });

    } catch (err: any) {
        console.error(`[FATAL] verify-otp: ${err?.message || 'Erro inesperado'}`);
        return NextResponse.json({
            sucesso: false,
            erro: 'Erro interno no processamento.',
            detalhes: process.env.NODE_ENV === 'development' ? err.message : undefined
        }, { status: 500 });
    }
}
