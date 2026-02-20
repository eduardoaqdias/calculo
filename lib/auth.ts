/**
 * lib/auth.ts — Autenticação client-side para modo estático
 * Credenciais de teste: qualquer e-mail @protege.com.br + senha 1234
 * OTP 2FA simulado (gerado e validado no client para ambiente estático)
 */

// Domínio corporativo permitido
export const DOMINIO_CORPORATIVO = 'protege.com.br';

// Credenciais de teste (ambiente estático)
const SENHA_ACESSO = '1234';

// Chave de armazenamento no sessionStorage
const AUTH_KEY = 'protege_auth_session';
const OTP_KEY = 'protege_otp_temp';

export interface SessaoUsuario {
    email: string;
    nome: string;
    autenticado: boolean;
    loginAt: number;
}

/** Valida se o e-mail pertence ao domínio corporativo */
export function validarDominioCorporativo(email: string): boolean {
    if (!email || typeof email !== 'string') return false;
    const emailLimpo = email.trim().toLowerCase();
    const regex = /^[a-zA-Z0-9._%+\-\.]+@protege\.com\.br$/i;
    return regex.test(emailLimpo);
}

/** Extrai nome do usuário a partir do e-mail */
export function extrairNome(email: string): string {
    const local = email.split('@')[0] ?? '';
    return local
        .split('.')
        .map(p => p.charAt(0).toUpperCase() + p.slice(1))
        .join(' ');
}

/** Mascara o e-mail para exibição (ex: ed••••o@protege.com.br) */
export function mascararEmail(email: string): string {
    const [local, dominio] = email.split('@');
    if (!local || local.length <= 2) return email;
    const inicio = local.charAt(0);
    const fim = local.charAt(local.length - 1);
    const pontos = '•'.repeat(Math.min(local.length - 2, 4));
    return `${inicio}${pontos}${fim}@${dominio}`;
}

/** Valida credenciais de login (domínio + senha) */
export function validarCredenciais(email: string, senha: string): boolean {
    return validarDominioCorporativo(email) && senha === SENHA_ACESSO;
}

/** Gera OTP de 6 dígitos aleatório */
export function gerarOtp(): string {
    return String(Math.floor(100000 + Math.random() * 900000));
}

/** Armazena OTP temporário com expiração de 5 minutos */
export function armazenarOtp(email: string, otp: string): void {
    const dados = {
        email: email.toLowerCase(),
        otp,
        expiracao: Date.now() + 5 * 60 * 1000, // 5 minutos
        tentativas: 0,
    };
    sessionStorage.setItem(OTP_KEY, JSON.stringify(dados));
}

/** Verifica OTP e retorna resultado */
export function verificarOtp(
    email: string,
    otpInformado: string
): { valido: boolean; erro?: string } {
    const raw = sessionStorage.getItem(OTP_KEY);
    if (!raw) return { valido: false, erro: 'Código não encontrado. Solicite um novo código.' };

    const dados = JSON.parse(raw) as {
        email: string;
        otp: string;
        expiracao: number;
        tentativas: number;
    };

    // Verifica expiração
    if (Date.now() > dados.expiracao) {
        sessionStorage.removeItem(OTP_KEY);
        return { valido: false, erro: 'Código expirado. Solicite um novo código.' };
    }

    // Verifica limite de tentativas
    if (dados.tentativas >= 3) {
        sessionStorage.removeItem(OTP_KEY);
        return { valido: false, erro: 'Muitas tentativas. Solicite um novo código.' };
    }

    // Verifica OTP
    if (dados.email !== email.toLowerCase() || dados.otp !== otpInformado.trim()) {
        dados.tentativas += 1;
        sessionStorage.setItem(OTP_KEY, JSON.stringify(dados));
        const restantes = 3 - dados.tentativas;
        return {
            valido: false,
            erro: restantes > 0
                ? `Código inválido. ${restantes} tentativa(s) restante(s).`
                : 'Código inválido. Solicite um novo código.',
        };
    }

    // OTP válido — limpa
    sessionStorage.removeItem(OTP_KEY);
    return { valido: true };
}

/** Cria sessão autenticada no sessionStorage */
export function criarSessao(email: string): SessaoUsuario {
    const sessao: SessaoUsuario = {
        email: email.toLowerCase(),
        nome: extrairNome(email),
        autenticado: true,
        loginAt: Date.now(),
    };
    sessionStorage.setItem(AUTH_KEY, JSON.stringify(sessao));
    return sessao;
}

/** Obtém sessão atual */
export function obterSessao(): SessaoUsuario | null {
    if (typeof window === 'undefined') return null;
    const raw = sessionStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    try {
        const sessao = JSON.parse(raw) as SessaoUsuario;
        // Sessão expira em 8 horas
        if (Date.now() - sessao.loginAt > 8 * 60 * 60 * 1000) {
            encerrarSessao();
            return null;
        }
        return sessao;
    } catch {
        return null;
    }
}

/** Encerra sessão */
export function encerrarSessao(): void {
    sessionStorage.removeItem(AUTH_KEY);
    sessionStorage.removeItem(OTP_KEY);
}

/** Verifica se o usuário está autenticado */
export function estaAutenticado(): boolean {
    return obterSessao()?.autenticado === true;
}
