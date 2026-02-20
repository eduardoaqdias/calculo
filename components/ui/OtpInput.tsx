'use client';

/**
 * OtpInput — 6 inputs individuais para código 2FA
 * Auto-focus, paste handler, backspace e animações staggered
 */

import { useRef, KeyboardEvent, ClipboardEvent, ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface OtpInputProps {
    value: string[];
    onChange: (valor: string[]) => void;
    erro?: boolean;
    desabilitado?: boolean;
}

export default function OtpInput({ value, onChange, erro, desabilitado }: OtpInputProps) {
    const refs = useRef<(HTMLInputElement | null)[]>([]);
    const TAMANHO = 6;

    function focarProximo(index: number) {
        if (index < TAMANHO - 1) {
            refs.current[index + 1]?.focus();
        }
    }

    function focarAnterior(index: number) {
        if (index > 0) {
            refs.current[index - 1]?.focus();
        }
    }

    function handleChange(index: number, e: ChangeEvent<HTMLInputElement>) {
        const digito = e.target.value.replace(/\D/g, '').slice(-1);
        const novo = [...value];
        novo[index] = digito;
        onChange(novo);
        if (digito) focarProximo(index);
    }

    function handleKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Backspace') {
            if (value[index]) {
                // Limpa o atual
                const novo = [...value];
                novo[index] = '';
                onChange(novo);
            } else {
                // Volta para o anterior
                focarAnterior(index);
            }
        } else if (e.key === 'ArrowLeft') {
            focarAnterior(index);
        } else if (e.key === 'ArrowRight') {
            focarProximo(index);
        }
    }

    function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
        e.preventDefault();
        const colado = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, TAMANHO);
        if (!colado) return;
        const novo = Array(TAMANHO).fill('');
        colado.split('').forEach((d, i) => {
            novo[i] = d;
        });
        onChange(novo);
        // Foca no último digito preenchido
        const ultimoIndex = Math.min(colado.length - 1, TAMANHO - 1);
        refs.current[ultimoIndex]?.focus();
    }

    return (
        <div className="flex gap-3 justify-center">
            {Array.from({ length: TAMANHO }).map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                        delay: i * 0.06,
                        type: 'spring',
                        stiffness: 300,
                        damping: 20,
                    }}
                >
                    <input
                        ref={el => { refs.current[i] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={value[i] ?? ''}
                        onChange={e => handleChange(i, e)}
                        onKeyDown={e => handleKeyDown(i, e)}
                        onPaste={handlePaste}
                        onFocus={e => e.target.select()}
                        disabled={desabilitado}
                        className={clsx(
                            // Tamanho e forma
                            'w-12 h-14 text-center text-xl font-bold rounded-xl',
                            // Border e fundo
                            'border-2 bg-white/[0.04] transition-all duration-200',
                            // Texto
                            'text-white tracking-wider',
                            // Outline personalizado
                            'focus:outline-none',
                            // Estados
                            erro
                                ? 'border-red-500/60 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.15)]'
                                : value[i]
                                    ? 'border-brand-500/80 shadow-[0_0_0_3px_rgba(40,116,239,0.12)] bg-brand-500/10'
                                    : 'border-white/10 focus:border-brand-500/70 focus:shadow-[0_0_0_3px_rgba(40,116,239,0.12)]',
                            desabilitado && 'opacity-50 cursor-not-allowed',
                        )}
                    />
                </motion.div>
            ))}
        </div>
    );
}
