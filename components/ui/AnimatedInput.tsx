'use client';

/**
 * AnimatedInput — Input corporativo com label flutuante e animações
 * Estados: idle, focus, erro, sucesso
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useState, forwardRef, InputHTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface AnimatedInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    erro?: string;
    sucesso?: string;
    icone?: React.ReactNode;
}

const AnimatedInput = forwardRef<HTMLInputElement, AnimatedInputProps>(
    ({ label, erro, sucesso, icone, className, id, ...props }, ref) => {
        const [focado, setFocado] = useState(false);
        const temValor = Boolean(props.value || props.defaultValue);
        const labelAtivo = focado || temValor;
        const inputId = id || label.toLowerCase().replace(/\s+/g, '-');

        const borderColor = erro
            ? 'border-red-500/60 focus-within:border-red-500'
            : sucesso
                ? 'border-green-500/60 focus-within:border-green-500'
                : 'border-white/10 focus-within:border-brand-500/70';

        const glowColor = erro
            ? 'focus-within:shadow-red-500/10'
            : sucesso
                ? 'focus-within:shadow-green-500/10'
                : 'focus-within:shadow-brand-500/10';

        return (
            <div className={clsx('relative', className)}>
                {/* Container do input */}
                <div
                    className={clsx(
                        'relative rounded-xl border bg-white/[0.04] transition-all duration-300',
                        'focus-within:shadow-lg',
                        borderColor,
                        glowColor,
                    )}
                >
                    {/* Label flutuante */}
                    <motion.label
                        htmlFor={inputId}
                        animate={{
                            top: labelAtivo ? '8px' : '50%',
                            translateY: labelAtivo ? '0%' : '-50%',
                            fontSize: labelAtivo ? '11px' : '14px',
                            color: focado
                                ? erro ? '#ef4444' : '#2874ef'
                                : erro
                                    ? '#ef4444'
                                    : '#94a3b8',
                        }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="absolute left-4 pointer-events-none font-medium z-10 leading-none"
                        style={{ top: '50%', transform: 'translateY(-50%)' }}
                    >
                        {label}
                    </motion.label>

                    {/* Input */}
                    <input
                        ref={ref}
                        id={inputId}
                        onFocus={() => setFocado(true)}
                        onBlur={() => setFocado(false)}
                        className={clsx(
                            'w-full bg-transparent text-white text-sm font-medium',
                            'pt-6 pb-2 rounded-xl outline-none transition-all duration-200',
                            icone || erro || sucesso ? 'pl-4 pr-12' : 'px-4',
                        )}
                        {...props}
                    />

                    {/* Ícone à direita */}
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center">
                        {erro ? (
                            <AlertCircle size={18} className="text-red-400" />
                        ) : sucesso ? (
                            <CheckCircle2 size={18} className="text-green-400" />
                        ) : icone ? (
                            <span className="text-slate-500">{icone}</span>
                        ) : null}
                    </div>
                </div>

                {/* Mensagem de erro/sucesso */}
                <AnimatePresence mode="wait">
                    {(erro || sucesso) && (
                        <motion.p
                            key={erro ? 'erro' : 'sucesso'}
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.2 }}
                            className={clsx(
                                'text-xs mt-1.5 ml-1 font-medium',
                                erro ? 'text-red-400' : 'text-green-400',
                            )}
                        >
                            {erro || sucesso}
                        </motion.p>
                    )}
                </AnimatePresence>
            </div>
        );
    },
);

AnimatedInput.displayName = 'AnimatedInput';

export default AnimatedInput;
