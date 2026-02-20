'use client';

/**
 * BackgroundFx — Efeito de fundo animado corporativo
 * Grid sutil + gradiente radial azul Protege
 */

import { motion } from 'framer-motion';

export default function BackgroundFx() {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden">
            {/* Gradiente de fundo principal */}
            <div className="absolute inset-0 bg-[#080d1a]" />

            {/* Grid pattern sutil */}
            <div
                className="absolute inset-0 opacity-40"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48' width='48' height='48' fill='none' stroke='rgb(40 116 239 / 0.07)'%3e%3cpath d='M0 .5H47.5V48'/%3e%3c/svg%3e")`,
                }}
            />

            {/* Orb azul superior esquerdo */}
            <motion.div
                animate={{
                    scale: [1, 1.15, 1],
                    opacity: [0.15, 0.25, 0.15],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full"
                style={{
                    background: 'radial-gradient(circle, rgba(40,116,239,0.35) 0%, transparent 70%)',
                }}
            />

            {/* Orb azul escuro inferior direito */}
            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.1, 0.2, 0.1],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
                className="absolute -bottom-60 -right-40 w-[700px] h-[700px] rounded-full"
                style={{
                    background: 'radial-gradient(circle, rgba(6,31,85,0.6) 0%, transparent 70%)',
                }}
            />

            {/* Linha decorativa horizontal animada */}
            <motion.div
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 12, repeat: Infinity, ease: 'linear', delay: 2 }}
                className="absolute top-1/3 left-0 w-1/3 h-px"
                style={{
                    background: 'linear-gradient(90deg, transparent, rgba(40,116,239,0.4), transparent)',
                }}
            />

            {/* Partículas flutuantes */}
            {[...Array(6)].map((_, i) => (
                <motion.div
                    key={i}
                    animate={{
                        y: [0, -20, 0],
                        opacity: [0.3, 0.7, 0.3],
                    }}
                    transition={{
                        duration: 4 + i * 1.2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: i * 0.8,
                    }}
                    className="absolute w-1 h-1 rounded-full bg-brand-500"
                    style={{
                        left: `${15 + i * 15}%`,
                        top: `${20 + (i % 3) * 25}%`,
                        opacity: 0.4,
                    }}
                />
            ))}
        </div>
    );
}
