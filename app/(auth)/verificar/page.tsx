'use client';

/**
 * Tela de Verificação em Duplo Fator (2FA) — Protege
 * 6 inputs OTP animados, countdown de 5 min, reenvio após 60s
 */

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, RefreshCcw, ArrowLeft, Clock } from 'lucide-react';

import BackgroundFx from '@/components/ui/BackgroundFx';
import OtpInput from '@/components/ui/OtpInput';
import Button from '@/components/ui/Button';
import Toast from '@/components/ui/Toast';
import OtpShowcase from '@/components/ui/OtpShowcase';
import {
    criarSessao,
    mascararEmail,
} from '@/lib/auth';

const TEMPO_OTP_SEG = 300; // 5 minutos
const TEMPO_REENVIO_SEG = 60;

export default function VerificarPage() {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
    const [carregando, setCarregando] = useState(false);
    const [sucesso, setSucesso] = useState(false);
    const [erroOtp, setErroOtp] = useState(false);
    const [tempoRestante, setTempoRestante] = useState(TEMPO_OTP_SEG);
    const [tempoReenvio, setTempoReenvio] = useState(0);
    const [otpDemo, setOtpDemo] = useState('');
    const [toast, setToast] = useState({ visivel: false, mensagem: '', tipo: 'erro' as 'sucesso' | 'erro' | 'aviso' });

    // Carrega e-mail da sessão 2FA
    useEffect(() => {
        const emailSalvo = sessionStorage.getItem('protege_2fa_email');
        if (!emailSalvo) {
            router.replace('/login');
            return;
        }
        setEmail(emailSalvo);

        // Recupera OTP inicial para exibição
        const initialOtp = sessionStorage.getItem('protege_2fa_otp_demo');
        if (initialOtp) setOtpDemo(initialOtp);
    }, [router]);

    // Countdown do OTP
    useEffect(() => {
        if (tempoRestante <= 0) return;
        const timer = setInterval(() => {
            setTempoRestante(t => {
                if (t <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return t - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [tempoRestante]);

    // Countdown reenvio
    useEffect(() => {
        if (tempoReenvio <= 0) return;
        const timer = setInterval(() => {
            setTempoReenvio(t => {
                if (t <= 1) { clearInterval(timer); return 0; }
                return t - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [tempoReenvio]);

    function formatar(seg: number) {
        const m = Math.floor(seg / 60).toString().padStart(2, '0');
        const s = (seg % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    }

    function exibirToast(mensagem: string, tipo: 'sucesso' | 'erro' | 'aviso' = 'erro') {
        setToast({ visivel: true, mensagem, tipo });
        setTimeout(() => setToast(t => ({ ...t, visivel: false })), 4000);
    }

    // Verificar OTP preenchido automaticamente (quando 6 dígitos)
    useEffect(() => {
        const codigo = otp.join('');
        if (codigo.length === 6 && !carregando && !sucesso) {
            handleVerificar(codigo);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [otp]);

    const handleVerificar = useCallback(async (codigo?: string) => {
        const codigoFinal = codigo ?? otp.join('');
        if (codigoFinal.length < 6) {
            exibirToast('Digite o código completo de 6 dígitos.', 'aviso');
            return;
        }
        if (tempoRestante <= 0) {
            exibirToast('Código expirado. Reenvie um novo código.', 'aviso');
            return;
        }

        setCarregando(true);
        setErroOtp(false);

        // Recupera o token JWT gerado no login
        const token = sessionStorage.getItem('protege_2fa_token');
        if (!token) {
            exibirToast('Sessão inválida. Faça login novamente.', 'erro');
            setCarregando(false);
            router.replace('/login');
            return;
        }

        try {
            // Chama a Azure Function verify-otp
            const resposta = await fetch('/api/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp: codigoFinal, token }),
            });

            const dados = await resposta.json();

            if (!resposta.ok || !dados.sucesso) {
                setCarregando(false);
                setErroOtp(true);
                setOtp(Array(6).fill(''));
                exibirToast(dados.erro ?? 'Código inválido.', 'erro');

                // Se o token expirou, força re-login
                if (resposta.status === 401 && dados.erro?.includes('expirado')) {
                    setTimeout(() => router.replace('/login'), 2500);
                }
                return;
            }

            // ✅ Verificação bem-sucedida
            criarSessao(email);
            setSucesso(true);
            setCarregando(false);
            sessionStorage.removeItem('protege_2fa_email');
            sessionStorage.removeItem('protege_2fa_token');

            // Redireciona para dashboard após animação de sucesso
            setTimeout(() => {
                router.push('/dashboard');
            }, 1500);

        } catch {
            // Erro de rede
            setCarregando(false);
            exibirToast('Erro de conexão. Verifique sua rede e tente novamente.', 'erro');
        }
    }, [email, otp, tempoRestante, router]);


    async function handleReenviar() {
        if (tempoReenvio > 0 || carregando) return;

        setCarregando(true);
        try {
            const resposta = await fetch('/api/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const dados = await resposta.json();

            if (!resposta.ok || !dados.sucesso) {
                exibirToast(dados.erro || 'Falha ao reenviar código.', 'erro');
                setCarregando(false);
                return;
            }

            // Atualiza token e OTP (demo)
            sessionStorage.setItem('protege_2fa_token', dados.token);
            if (dados.otp) {
                sessionStorage.setItem('protege_2fa_otp_demo', dados.otp);
                setOtpDemo(dados.otp);
            }

            setOtp(Array(6).fill(''));
            setErroOtp(false);
            setTempoRestante(TEMPO_OTP_SEG);
            setTempoReenvio(TEMPO_REENVIO_SEG);
            exibirToast('Novo código enviado com sucesso.', 'sucesso');
        } catch {
            exibirToast('Erro ao conectar com o servidor.', 'erro');
        } finally {
            setCarregando(false);
        }
    }

    const porcentagemTempo = (tempoRestante / TEMPO_OTP_SEG) * 100;
    const emailMascarado = email ? mascararEmail(email) : '';

    return (
        <>
            <BackgroundFx />

            <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-md"
            >
                <div className="relative rounded-3xl border border-white/8 bg-white/[0.03] backdrop-blur-2xl shadow-2xl shadow-black/50 overflow-hidden">
                    {/* Linha decorativa superior */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/60 to-transparent" />

                    <div className="p-8 md:p-10">
                        {/* Botão voltar */}
                        <motion.button
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            onClick={() => router.push('/login')}
                            className="flex items-center gap-1.5 text-slate-500 hover:text-slate-300 transition-colors text-sm mb-6 group"
                        >
                            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
                            Voltar ao login
                        </motion.button>

                        {/* Ícone e título */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                            className="text-center mb-8"
                        >
                            {/* Ícone com animação de sucesso */}
                            <AnimatePresence mode="wait">
                                {sucesso ? (
                                    <motion.div
                                        key="sucesso"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1, rotate: [0, -10, 10, 0] }}
                                        transition={{ type: 'spring', stiffness: 300 }}
                                        className="flex justify-center mb-4"
                                    >
                                        <div className="w-16 h-16 rounded-2xl bg-green-500/15 border border-green-500/30 flex items-center justify-center">
                                            <ShieldCheck size={32} className="text-green-400" />
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="normal"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex justify-center mb-4"
                                    >
                                        <div className="relative">
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                                                className="absolute inset-0 rounded-2xl border border-brand-500/20"
                                                style={{ borderStyle: 'dashed' }}
                                            />
                                            <div className="w-16 h-16 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
                                                <ShieldCheck size={28} className="text-brand-400" />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <AnimatePresence mode="wait">
                                {sucesso ? (
                                    <motion.div
                                        key="texto-sucesso"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
                                        <h1 className="text-2xl font-bold text-white">Acesso liberado!</h1>
                                        <p className="text-sm text-green-400 mt-1">Redirecionando para a plataforma...</p>
                                    </motion.div>
                                ) : (
                                    <motion.div key="texto-normal">
                                        <h1 className="text-2xl font-bold text-white">Verificação em Duplo Fator</h1>
                                        <p className="text-sm text-slate-400 mt-1.5">
                                            Código enviado para{' '}
                                            <span className="text-slate-300 font-mono">{emailMascarado}</span>
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        {!sucesso && (
                            <>
                                {/* Barra de progresso do tempo */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="mb-6"
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center gap-1.5">
                                            <Clock size={13} className={tempoRestante < 60 ? 'text-amber-400' : 'text-slate-500'} />
                                            <span className={`text-xs font-mono ${tempoRestante < 60 ? 'text-amber-400' : 'text-slate-500'}`}>
                                                {formatar(tempoRestante)}
                                            </span>
                                        </div>
                                        <span className="text-xs text-slate-600">Código válido por 5 minutos</span>
                                    </div>
                                    <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                                        <motion.div
                                            className={`h-full rounded-full transition-colors duration-1000 ${tempoRestante < 60 ? 'bg-amber-500' : 'bg-brand-500'
                                                }`}
                                            animate={{ width: `${porcentagemTempo}%` }}
                                            transition={{ duration: 1, ease: 'linear' }}
                                        />
                                    </div>
                                </motion.div>

                                {/* OTP inputs */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.25 }}
                                    className="mb-6"
                                >
                                    <OtpInput
                                        value={otp}
                                        onChange={setOtp}
                                        erro={erroOtp}
                                        desabilitado={carregando || tempoRestante === 0}
                                    />

                                    <AnimatePresence>
                                        {erroOtp && (
                                            <motion.p
                                                initial={{ opacity: 0, y: -5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0 }}
                                                className="text-center text-xs text-red-400 mt-3 font-medium"
                                            >
                                                Código inválido — verifique e tente novamente
                                            </motion.p>
                                        )}
                                        {tempoRestante === 0 && (
                                            <motion.p
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="text-center text-xs text-amber-400 mt-3"
                                            >
                                                Código expirado. Solicite um novo abaixo.
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                </motion.div>

                                {/* Botão verificar */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.35 }}
                                >
                                    <Button
                                        variante="primary"
                                        fullWidth
                                        carregando={carregando}
                                        disabled={otp.join('').length < 6 || tempoRestante === 0}
                                        onClick={() => handleVerificar()}
                                    >
                                        {carregando ? 'Verificando...' : 'Confirmar Código'}
                                    </Button>
                                </motion.div>

                                {/* Reenviar código */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="text-center mt-5"
                                >
                                    <button
                                        onClick={handleReenviar}
                                        disabled={tempoReenvio > 0}
                                        className={`inline-flex items-center gap-1.5 text-sm transition-all ${tempoReenvio > 0
                                            ? 'text-slate-600 cursor-not-allowed'
                                            : 'text-brand-400 hover:text-brand-300'
                                            }`}
                                    >
                                        <RefreshCcw size={13} className={tempoReenvio > 0 ? '' : 'group-hover:rotate-180 transition-transform'} />
                                        {tempoReenvio > 0
                                            ? `Reenviar em ${tempoReenvio}s`
                                            : 'Reenviar código'}
                                    </button>
                                </motion.div>

                                {/* Dica elegante para modo demo */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.6 }}
                                    className="mt-6 flex items-center justify-center gap-2"
                                >
                                    <div className="w-1 h-1 rounded-full bg-brand-500/40" />
                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-medium">
                                        Ambiente de Demonstração
                                    </p>
                                    <div className="w-1 h-1 rounded-full bg-brand-500/40" />
                                </motion.div>
                            </>
                        )}
                    </div>
                </div>
            </motion.div>

            <OtpShowcase otp={otpDemo} show={!sucesso && !!otpDemo} />

            <Toast
                visivel={toast.visivel}
                mensagem={toast.mensagem}
                tipo={toast.tipo}
                onFechar={() => setToast(t => ({ ...t, visivel: false }))}
            />
        </>
    );
}
