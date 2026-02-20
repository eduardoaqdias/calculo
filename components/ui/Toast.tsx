'use client';

/**
 * Toast — Notificações elegantes com animação slide
 * Tipos: sucesso, erro, aviso
 */

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, AlertTriangle, X } from 'lucide-react';
import { clsx } from 'clsx';

type TipoToast = 'sucesso' | 'erro' | 'aviso';

interface ToastProps {
    visivel: boolean;
    mensagem: string;
    tipo?: TipoToast;
    onFechar?: () => void;
}

const config = {
    sucesso: {
        icone: CheckCircle2,
        bg: 'bg-green-500/10 border-green-500/20',
        texto: 'text-green-400',
        iconeClass: 'text-green-400',
    },
    erro: {
        icone: AlertCircle,
        bg: 'bg-red-500/10 border-red-500/20',
        texto: 'text-red-300',
        iconeClass: 'text-red-400',
    },
    aviso: {
        icone: AlertTriangle,
        bg: 'bg-amber-500/10 border-amber-500/20',
        texto: 'text-amber-300',
        iconeClass: 'text-amber-400',
    },
};

export default function Toast({ visivel, mensagem, tipo = 'sucesso', onFechar }: ToastProps) {
    const { icone: Icone, bg, texto, iconeClass } = config[tipo];

    return (
        <AnimatePresence>
            {visivel && (
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    className={clsx(
                        'fixed bottom-6 right-6 z-50 flex items-center gap-3',
                        'rounded-2xl border px-5 py-4 shadow-2xl backdrop-blur-xl',
                        'max-w-sm min-w-[260px]',
                        bg,
                    )}
                >
                    <Icone size={18} className={clsx('flex-shrink-0', iconeClass)} />
                    <p className={clsx('text-sm font-medium flex-1', texto)}>{mensagem}</p>
                    {onFechar && (
                        <button
                            onClick={onFechar}
                            className="text-slate-500 hover:text-slate-300 transition-colors ml-1"
                        >
                            <X size={14} />
                        </button>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
