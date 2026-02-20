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
    bg-brand-500 hover:bg-brand-600 text-white border border-brand-500/20
    shadow-xl shadow-brand-500/10 hover:shadow-brand-500/30 dark:shadow-brand-500/5
    shadow-inner-glow
  `,
    secondary: `
    bg-foreground/[0.03] hover:bg-foreground/[0.06] text-foreground border border-border/80
    hover:border-foreground/10 shadow-sm
  `,
    ghost: `
    bg-transparent hover:bg-foreground/[0.04] text-muted hover:text-foreground
    border border-transparent hover:border-border/50
  `,
    danger: `
    bg-red-500/5 hover:bg-red-500/10 text-red-600 dark:text-red-400 
    border border-red-500/10 hover:border-red-500/30
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
