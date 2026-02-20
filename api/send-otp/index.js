/**
 * Azure Function: send-otp
 * POST /api/send-otp
 *
 * Recebe: { email: string }
 * Valida: domínio @protege.com.br
 * Gera: OTP de 6 dígitos
 * Assina: JWT stateless com OTP + email + expiração (5 min)
 * Envia: E-mail HTML via SMTP (Office 365 / Exchange)
 * Retorna: { success: true, token: "..." }
 *
 * Variáveis de ambiente necessárias (Azure App Settings):
 *   SMTP_HOST  — ex: smtp.office365.com
 *   SMTP_PORT  — ex: 587
 *   SMTP_USER  — e-mail remetente (ex: noreply@protege.com.br)
 *   SMTP_PASS  — senha ou App Password do remetente
 *   OTP_JWT_SECRET — chave secreta para assinar o token (min 32 chars)
 */

const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

// ─── Constantes ──────────────────────────────────────────────────────────────
const DOMINIO_PERMITIDO = 'protege.com.br';
const OTP_TTL_SEGUNDOS = 300; // 5 minutos

// Rate limiting simples em memória (por instância de função)
// Para escala, usar Azure Cache for Redis ou Table Storage
const tentativas = new Map(); // email -> { count, resetAt }

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Valida domínio corporativo */
function dominioValido(email) {
  return /^[a-zA-Z0-9._%+\-]+@protege\.com\.br$/i.test((email || '').trim());
}

/** Gera OTP numérico de 6 dígitos */
function gerarOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

/** Verifica rate limit: máximo 3 envios por e-mail a cada 15 minutos */
function verificarRateLimit(email) {
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
      // Janela expirada — reseta
      tentativas.set(chave, { count: 1, resetAt: agora + 15 * 60 * 1000 });
    }
  } else {
    tentativas.set(chave, { count: 1, resetAt: agora + 15 * 60 * 1000 });
  }
  return { bloqueado: false };
}

/** Assina o OTP em um JWT com expiração de 5 minutos */
function assinarToken(email, otp) {
  const segredo = process.env.OTP_JWT_SECRET || 'protege-otp-secret-inseguro-dev';
  return jwt.sign(
    { email: email.toLowerCase().trim(), otp, iss: 'protege-2fa' },
    segredo,
    { expiresIn: OTP_TTL_SEGUNDOS }
  );
}

/** Cria o transporter SMTP do Nodemailer */
function criarTransporter() {
  const host = process.env.SMTP_HOST || 'smtp.office365.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    throw new Error('SMTP_USER e SMTP_PASS não configurados nas variáveis de ambiente.');
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    tls: {
      // Compatibilidade com Office 365
      ciphers: 'SSLv3',
      rejectUnauthorized: false,
    },
  });
}

/** Template HTML do e-mail OTP */
function templateEmail(nome, otp) {
  const digitos = otp.split('').map(d =>
    `<span style="
      display:inline-block;
      width:48px;height:60px;
      line-height:60px;
      text-align:center;
      font-size:28px;
      font-weight:700;
      color:#ffffff;
      background:#1a3a6e;
      border-radius:10px;
      margin:0 4px;
      letter-spacing:0;
      font-family:monospace;
    ">${d}</span>`
  ).join('');

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Código de Verificação — Protege</title>
</head>
<body style="margin:0;padding:0;background:#080d1a;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#080d1a;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="
            background:#111827;
            border-radius:20px;
            border:1px solid rgba(255,255,255,0.08);
            overflow:hidden;
            max-width:560px;
            width:100%;
          ">

          <!-- Cabeçalho com logo -->
          <tr>
            <td style="
                background:linear-gradient(135deg,#0a1628 0%,#1a3a6e 100%);
                padding:32px 40px;
                text-align:center;
                border-bottom:1px solid rgba(255,255,255,0.08);
              ">
              <img
                src="https://www.protege.com.br/media/ovmn4be5/main-logo.svg"
                alt="Protege"
                width="130"
                style="filter:brightness(0) invert(1);display:block;margin:0 auto 12px;"
              />
              <p style="margin:0;font-size:12px;color:rgba(148,163,184,0.7);letter-spacing:0.1em;text-transform:uppercase;">
                Plataforma Corporativa
              </p>
            </td>
          </tr>

          <!-- Corpo principal -->
          <tr>
            <td style="padding:36px 40px;">

              <!-- Saudação -->
              <p style="margin:0 0 8px;font-size:14px;color:#94a3b8;">
                Olá, <strong style="color:#e2e8f0;">${nome}</strong>
              </p>
              <h1 style="margin:0 0 20px;font-size:22px;font-weight:700;color:#ffffff;line-height:1.3;">
                Verificação em Duplo Fator
              </h1>

              <!-- Texto explicativo -->
              <p style="margin:0 0 28px;font-size:14px;color:#94a3b8;line-height:1.6;">
                Seu código de verificação para acesso à
                <strong style="color:#e2e8f0;">Plataforma Protege</strong> é:
              </p>

              <!-- OTP em destaque -->
              <div style="text-align:center;margin:0 0 28px;">
                <div style="
                    display:inline-block;
                    background:rgba(40,116,239,0.08);
                    border:1px solid rgba(40,116,239,0.25);
                    border-radius:16px;
                    padding:20px 28px;
                  ">
                  ${digitos}
                </div>
              </div>

              <!-- Aviso de expiração -->
              <div style="
                  background:rgba(245,158,11,0.08);
                  border:1px solid rgba(245,158,11,0.2);
                  border-radius:12px;
                  padding:14px 18px;
                  margin-bottom:24px;
                ">
                <p style="margin:0;font-size:13px;color:#f59e0b;text-align:center;">
                  ⏱ Este código expira em <strong>5 minutos</strong>.
                  Não compartilhe com ninguém.
                </p>
              </div>

              <!-- Aviso de segurança -->
              <div style="
                  background:rgba(239,68,68,0.06);
                  border:1px solid rgba(239,68,68,0.15);
                  border-radius:12px;
                  padding:14px 18px;
                ">
                <p style="margin:0;font-size:12px;color:#f87171;line-height:1.5;">
                  🔒 Se você não solicitou este código, ignore este e-mail.
                  Sua conta permanece segura.
                </p>
              </div>
            </td>
          </tr>

          <!-- Rodapé -->
          <tr>
            <td style="
                padding:20px 40px;
                border-top:1px solid rgba(255,255,255,0.06);
                text-align:center;
              ">
              <p style="margin:0;font-size:12px;color:rgba(148,163,184,0.4);">
                © ${new Date().getFullYear()} Protege Segurança e Vigilância Ltda.
                <br/>Este é um e-mail automático. Não responda.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ─── Handler principal ────────────────────────────────────────────────────────
module.exports = async function (context, req) {
  // Headers CORS para o front-end Next.js
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
    const { email } = req.body || {};

    // Validação de entrada
    if (!email || typeof email !== 'string') {
      context.res = {
        status: 400, headers,
        body: JSON.stringify({ sucesso: false, erro: 'E-mail é obrigatório.' }),
      };
      return;
    }

    const emailLimpo = email.trim().toLowerCase();

    // Validação de domínio (server-side obrigatório)
    if (!dominioValido(emailLimpo)) {
      context.res = {
        status: 403, headers,
        body: JSON.stringify({
          sucesso: false,
          erro: 'Acesso restrito a usuários corporativos da Protege.',
        }),
      };
      return;
    }

    // Rate limiting
    const rl = verificarRateLimit(emailLimpo);
    if (rl.bloqueado) {
      context.res = {
        status: 429, headers,
        body: JSON.stringify({ sucesso: false, erro: rl.mensagem }),
      };
      return;
    }

    // Gera OTP e assina o token JWT
    const otp = gerarOtp();
    const token = assinarToken(emailLimpo, otp);

    // Extrai nome a partir do e-mail (parte local)
    const nomeLocal = emailLimpo.split('@')[0] ?? '';
    const nome = nomeLocal.split('.').map(p =>
      p.charAt(0).toUpperCase() + p.slice(1)
    ).join(' ');

    // ──────────────────────────────────────────────
    // 🚧 MODO DEMO — envio de e-mail desabilitado
    // Para habilitar: remova este bloco e
    // descomente o bloco "Envia e-mail" abaixo
    // ──────────────────────────────────────────────
    context.log(`[2FA DEMO] OTP para ${emailLimpo.replace(/(.{2}).*(@.*)/, '$1***$2')}: ${otp}`);
    context.log(`[2FA DEMO] Token JWT: ${token.slice(0, 20)}...`);

    /*
    // ── Habilitar para produção: ──────────────────
    const transporter = criarTransporter();
    await transporter.sendMail({
      from: `"Protege Plataforma" <${process.env.SMTP_USER}>`,
      to: emailLimpo,
      subject: '🔐 Seu código de verificação — Protege',
      html: templateEmail(nome, otp),
      text: `Olá, ${nome}!\n\nSeu código de verificação é: ${otp}\n\nEste código expira em 5 minutos.\n\n— Protege Plataforma`,
    });
    // ─────────────────────────────────────────────
    */

    context.res = {
      status: 200, headers,
      body: JSON.stringify({ sucesso: true, token }),
    };

  } catch (err) {
    context.log.error('[send-otp] Erro:', err.message);
    context.res = {
      status: 500, headers,
      body: JSON.stringify({
        sucesso: false,
        erro: 'Falha ao enviar o código. Tente novamente.',
      }),
    };
  }
};
