'use client';

/**
 * Tela de Login Corporativo — Protege
 * Valida e-mail @protege.com.br + senha 1234 (modo estático / teste)
 * Framer Motion para animações premium
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, Shield, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';

import BackgroundFx from '@/components/ui/BackgroundFx';
import AnimatedInput from '@/components/ui/AnimatedInput';
import Button from '@/components/ui/Button';
import Toast from '@/components/ui/Toast';
import {
    validarDominioCorporativo,
    validarCredenciais,
    gerarOtp,
    armazenarOtp,
} from '@/lib/auth';

// Variantes de animação (staggered)
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: 'spring', stiffness: 300, damping: 25 },
    },
};

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [carregando, setCarregando] = useState(false);
    const [erroEmail, setErroEmail] = useState('');
    const [erroSenha, setErroSenha] = useState('');
    const [toast, setToast] = useState({ visivel: false, mensagem: '', tipo: 'erro' as const });

    // Valida domínio em tempo real ao digitar
    function handleEmailChange(valor: string) {
        setEmail(valor);
        setErroEmail('');
        if (valor && valor.includes('@')) {
            const dominio = valor.split('@')[1] ?? '';
            if (dominio && !validarDominioCorporativo(valor)) {
                setErroEmail('Acesso restrito a usuários corporativos da Protege.');
            }
        }
    }

    // Exibe e fecha toast
    function exibirToast(mensagem: string, tipo: 'sucesso' | 'erro' | 'aviso' = 'erro') {
        setToast({ visivel: true, mensagem, tipo });
        setTimeout(() => setToast(t => ({ ...t, visivel: false })), 4000);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        // Validações
        let valido = true;
        if (!email) {
            setErroEmail('Informe seu e-mail corporativo.');
            valido = false;
        } else if (!validarDominioCorporativo(email)) {
            setErroEmail('Acesso restrito a usuários corporativos da Protege.');
            valido = false;
        }
        if (!senha) {
            setErroSenha('Informe sua senha de acesso.');
            valido = false;
        }
        if (!valido) return;

        setCarregando(true);

        // Simula delay de rede
        await new Promise(r => setTimeout(r, 1200));

        if (!validarCredenciais(email, senha)) {
            setCarregando(false);
            setErroSenha('Credenciais inválidas. Verifique e tente novamente.');
            exibirToast('Acesso negado. Credenciais inválidas.', 'erro');
            return;
        }

        // Gera e armazena OTP
        const otp = gerarOtp();
        armazenarOtp(email, otp);

        // Em dev/estático: exibe o OTP em console (sem SMTP)
        console.info(`[Protege 2FA] OTP para ${email}: ${otp}`);

        setCarregando(false);

        // Redireciona para tela 2FA passando e-mail via sessionStorage
        sessionStorage.setItem('protege_2fa_email', email);
        router.push('/verificar');
    }

    const emailValido = email && !erroEmail && validarDominioCorporativo(email);

    return (
        <>
            <BackgroundFx />

            <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-md"
            >
                {/* Card principal com glassmorphism */}
                <div className="relative rounded-3xl border border-white/8 bg-white/[0.03] backdrop-blur-2xl shadow-2xl shadow-black/50 overflow-hidden">
                    {/* Linha decorativa superior */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/60 to-transparent" />

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="p-8 md:p-10"
                    >
                        {/* Logo e cabeçalho */}
                        <motion.div variants={itemVariants} className="text-center mb-8">
                            <div className="flex justify-center mb-5">
                                <div className="relative">
                                    {/* Halo animado atrás do logo */}
                                    <motion.div
                                        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                                        className="absolute inset-0 rounded-2xl bg-brand-500/20 blur-xl"
                                    />
                                    <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-500/10 border border-brand-500/20">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src="https://www.protege.com.br/media/ovmn4be5/main-logo.svg"
                                            alt="Protege"
                                            className="h-8 w-auto filter brightness-0 invert"
                                        />
                                    </div>
                                </div>
                            </div>

                            <h1 className="text-2xl font-bold text-white tracking-tight">
                                Acesso Corporativo
                            </h1>
                            <p className="text-sm text-slate-400 mt-1.5">
                                Plataforma exclusiva para colaboradores Protege
                            </p>
                        </motion.div>

                        {/* Badge de segurança */}
                        <motion.div variants={itemVariants}>
                            <div className="flex items-center gap-2 bg-brand-500/8 border border-brand-500/15 rounded-xl px-4 py-2.5 mb-6">
                                <Shield size={14} className="text-brand-400 flex-shrink-0" />
                                <p className="text-xs text-slate-400">
                                    <span className="text-brand-400 font-medium">Acesso restrito</span> — somente
                                    {' '}<span className="font-mono text-slate-300">@protege.com.br</span>
                                </p>
                            </div>
                        </motion.div>

                        {/* Formulário */}
                        <motion.form
                            variants={containerVariants}
                            onSubmit={handleSubmit}
                            noValidate
                        >
                            <motion.div variants={itemVariants} className="space-y-4">
                                {/* Campo e-mail */}
                                <AnimatedInput
                                    label="E-mail Corporativo"
                                    type="email"
                                    value={email}
                                    onChange={e => handleEmailChange(e.target.value)}
                                    erro={erroEmail}
                                    sucesso={emailValido ? 'Domínio corporativo válido' : undefined}
                                    icone={<Mail size={16} />}
                                    autoComplete="email"
                                    autoFocus
                                    disabled={carregando}
                                />

                                {/* Campo senha */}
                                <div className="relative">
                                    <AnimatedInput
                                        label="Senha de Acesso"
                                        type={mostrarSenha ? 'text' : 'password'}
                                        value={senha}
                                        onChange={e => { setSenha(e.target.value); setErroSenha(''); }}
                                        erro={erroSenha}
                                        icone={<Lock size={16} />}
                                        autoComplete="current-password"
                                        disabled={carregando}
                                    />
                                    {/* Toggle mostrar senha */}
                                    <button
                                        type="button"
                                        tabIndex={-1}
                                        onClick={() => setMostrarSenha(v => !v)}
                                        className="absolute right-4 top-[22px] text-slate-500 hover:text-slate-300 transition-colors z-10"
                                    >
                                        {mostrarSenha ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </motion.div>

                            <motion.div variants={itemVariants} className="mt-6">
                                <Button
                                    type="submit"
                                    variante="primary"
                                    fullWidth
                                    carregando={carregando}
                                    icone={!carregando ? <ArrowRight size={16} /> : undefined}
                                >
                                    {carregando ? 'Validando acesso...' : 'Acessar Plataforma'}
                                </Button>
                            </motion.div>
                        </motion.form>

                        {/* Dica de credenciais de teste */}
                        <motion.div variants={itemVariants} className="mt-6">
                            <div className="rounded-xl bg-white/[0.03] border border-white/6 px-4 py-3 text-center">
                                <p className="text-xs text-slate-500 font-mono">
                                    <span className="text-slate-400">Demo:</span>{' '}
                                    qualquer <span className="text-brand-400">@protege.com.br</span>
                                    {' '}·{' '}
                                    senha <span className="text-brand-400">1234</span>
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Rodapé do card */}
                    <div className="px-8 pb-6 text-center">
                        <p className="text-xs text-slate-600">
                            © {new Date().getFullYear()} Protege Segurança e Vigilância
                        </p>
                    </div>
                </div>

                {/* Indicadores de status externos */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="flex justify-center gap-4 mt-5"
                >
                    <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse-slow" />
                        <span className="text-xs text-slate-600">Sistemas operacionais</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />
                        <span className="text-xs text-slate-600">Conexão segura</span>
                    </div>
                </motion.div>
            </motion.div>

            <Toast
                visivel={toast.visivel}
                mensagem={toast.mensagem}
                tipo={toast.tipo}
                onFechar={() => setToast(t => ({ ...t, visivel: false }))}
            />
        </>
    );
}
