import { NextResponse } from 'next/server';
import crypto from 'node:crypto';

function base64url(str: string | Buffer) {
    const buf = typeof str === 'string' ? Buffer.from(str) : str;
    return buf.toString('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
}

const DOMINIO_PERMITIDO = 'protege.com.br';
const OTP_TTL_SEGUNDOS = 300; // 5 minutos

// Rate limiting simples em memória (por instância de função)
const tentativas = new Map<string, { count: number; resetAt: number }>();

function dominioValido(email: string) {
    return /^[a-zA-Z0-9._%+\-\.]+@protege\.com\.br$/i.test((email || '').trim());
}

function gerarOtp() {
    return String(Math.floor(100000 + Math.random() * 900000));
}

function verificarRateLimit(email: string) {
    const agora = Date.now();
    const chave = email.toLowerCase();
    const registro = tentativas.get(chave);

    if (registro) {
        if (agora < registro.resetAt) {
            if (registro.count >= 3) {
                const restantes = Math.ceil((registro.resetAt - agora) / 60000);
                return { bloqueado: true, mensagem: `Muitas tentativas. Tente novamente em ${restantes} minuto(s).` };
            }
            registro.count += 1;
            tentativas.set(chave, registro);
        } else {
            tentativas.set(chave, { count: 1, resetAt: agora + 15 * 60 * 1000 });
        }
    } else {
        tentativas.set(chave, { count: 1, resetAt: agora + 15 * 60 * 1000 });
    }
    return { bloqueado: false };
}

function assinarToken(email: string, otp: string) {
    const segredo = process.env.OTP_JWT_SECRET || 'protege-otp-secret-inseguro-dev';
    const header = { alg: 'HS256', typ: 'JWT' };
    const payload = {
        email: email.toLowerCase().trim(),
        otp,
        iss: 'protege-2fa',
        exp: Math.floor(Date.now() / 1000) + OTP_TTL_SEGUNDOS
    };

    const h = base64url(JSON.stringify(header));
    const p = base64url(JSON.stringify(payload));

    try {
        const hmac = crypto.createHmac('sha256', segredo);
        const sig = base64url(hmac.update(`${h}.${p}`).digest());
        return `${h}.${p}.${sig}`;
    } catch (e: any) {
        console.error('[JWT] Erro ao assinar:', e.message);
        throw new Error('Falha na assinatura do token');
    }
}

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ sucesso: false, erro: 'E-mail é obrigatório.' }, { status: 400 });
        }

        const emailLimpo = String(email).trim().toLowerCase();

        if (!dominioValido(emailLimpo)) {
            return NextResponse.json({ sucesso: false, erro: 'Acesso restrito a usuários Protege.' }, { status: 403 });
        }

        const rl = verificarRateLimit(emailLimpo);
        if (rl.bloqueado) {
            return NextResponse.json({ sucesso: false, erro: rl.mensagem }, { status: 429 });
        }

        const otp = gerarOtp();
        const token = assinarToken(emailLimpo, otp);

        console.log(`[2FA DEMO] EMAIL: ${emailLimpo} | OTP: ${otp}`);

        return NextResponse.json({
            sucesso: true,
            token,
            otp, // Incluído para exibição em modo demo conforme solicitado
            debug: 'OTP enviado para exibição em tela'
        });

    } catch (err: any) {
        console.error(`[ERROR] send-otp: ${err?.message || 'Erro desconhecido'}`);
        return NextResponse.json({
            sucesso: false,
            erro: 'Erro interno na API.',
            detalhes: process.env.NODE_ENV === 'development' ? err.message : undefined
        }, { status: 500 });
    }
}
