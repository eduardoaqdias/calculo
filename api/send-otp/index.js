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

const crypto = require('crypto');

function base64url(str) {
  return Buffer.from(str).toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

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

/** Assina o OTP em um JWT com expiração de 5 minutos usando crypto nativo */
function assinarToken(email, otp) {
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
  const sig = base64url(crypto.createHmac('sha256', segredo).update(`${h}.${p}`).digest());
  return `${h}.${p}.${sig}`;
}

/** Cria o transporter SMTP do Nodemailer - Comentado p/ deploy sem mods */
function criarTransporter() {
  /*
  const host = process.env.SMTP_HOST || 'smtp.office365.com';
  // ... omite config original
  */
  return null;
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
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Preflight CORS
  if (req.method === 'OPTIONS') {
    context.res = { status: 204, headers, body: '' };
    return;
  }

  // Teste de vida (GET /api/send-otp)
  if (req.method === 'GET') {
    context.res = {
      status: 200, headers,
      body: JSON.stringify({ mensagem: 'API send-otp está online e pronta.' }),
    };
    return;
  }

  try {
    const { email } = req.body || {};

    if (!email) {
      context.res = {
        status: 400, headers,
        body: JSON.stringify({ sucesso: false, erro: 'E-mail é obrigatório.' }),
      };
      return;
    }

    const emailLimpo = String(email).trim().toLowerCase();

    if (!dominioValido(emailLimpo)) {
      context.res = {
        status: 403, headers,
        body: JSON.stringify({ sucesso: false, erro: 'Acesso restrito a usuários Protege.' }),
      };
      return;
    }

    const rl = verificarRateLimit(emailLimpo);
    if (rl.bloqueado) {
      context.res = { status: 429, headers, body: JSON.stringify({ sucesso: false, erro: rl.mensagem }) };
      return;
    }

    const otp = gerarOtp();
    const token = assinarToken(emailLimpo, otp);

    const nomeLocal = emailLimpo.split('@')[0] ?? '';
    const nome = nomeLocal.split('.').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');

    // MODO DEMO — LOG NO CONSOLE DO AZURE / TERMINAL SWA
    context.log(`[2FA DEMO] EMAIL: ${emailLimpo} | OTP: ${otp}`);

    /*
    // Para produção:
    const transporter = criarTransporter();
    await transporter.sendMail({ ... });
    */

    context.res = {
      status: 200, headers,
      body: JSON.stringify({ sucesso: true, token, debug: 'OTP enviado ao log' }),
    };

  } catch (err) {
    context.log(`[ERROR] send-otp: ${err.message}`);
    context.res = {
      status: 500, headers,
      body: JSON.stringify({ sucesso: false, erro: 'Erro interno na API.' }),
    };
  }
};
