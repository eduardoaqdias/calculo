'use client';

/**
 * Button — Botão corporativo com variantes e states
 * Framer Motion para micro-interações
 */

import { motion, HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
    variante?: Variant;
    carregando?: boolean;
    icone?: React.ReactNode;
    children: React.ReactNode;
    fullWidth?: boolean;
}

const estilos: Record<Variant, string> = {
    primary: `
    bg-brand-500 hover:bg-brand-600 text-white border border-brand-500
    hover:border-brand-600 shadow-lg shadow-brand-500/20
    hover:shadow-brand-500/40
  `,
    secondary: `
    bg-white/5 hover:bg-white/10 text-white border border-white/10
    hover:border-white/20
  `,
    ghost: `
    bg-transparent hover:bg-white/5 text-slate-300 hover:text-white
    border border-transparent hover:border-white/10
  `,
    danger: `
    bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300
    border border-red-500/20 hover:border-red-500/40
  `,
};

export default function Button({
    variante = 'secondary',
    carregando = false,
    icone,
    children,
    fullWidth = false,
    disabled,
    className,
    ...props
}: ButtonProps) {
    const isDisabled = disabled || carregando;

    return (
        <motion.button
            whileHover={!isDisabled ? { scale: 1.01 } : {}}
            whileTap={!isDisabled ? { scale: 0.98 } : {}}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            disabled={isDisabled}
            className={clsx(
                'relative flex items-center justify-center gap-2',
                'rounded-xl px-5 py-3 text-sm font-semibold',
                'transition-all duration-200 cursor-pointer',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50',
                estilos[variante],
                fullWidth && 'w-full',
                isDisabled && 'opacity-50 cursor-not-allowed pointer-events-none',
                className,
            )}
            {...props}
        >
            {carregando ? (
                <Loader2 size={16} className="animate-spin" />
            ) : icone ? (
                <span className="flex-shrink-0">{icone}</span>
            ) : null}
            {children}
        </motion.button>
    );
}
