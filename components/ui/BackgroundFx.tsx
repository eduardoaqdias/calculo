'use client';

/**
 * BackgroundFx — Efeito de fundo premium
 * • Orb luminoso que SEGUE O MOUSE (cursor tracking suave via lerp)
 * • Grid de pontos sutil
 * • Partículas flutuantes
 * • Cores da identidade visual Protege: azul #043154 + dourado #95793c
 */

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function BackgroundFx() {
    const orbRef = useRef<HTMLDivElement>(null);
    // Posição atual do orb (com lerp para suavidade)
    const pos = useRef({ x: 0, y: 0 });
    // Posição alvo (mouse)
    const target = useRef({ x: 0, y: 0 });
    const raf = useRef<number>(0);

    useEffect(() => {
        // Inicializa no centro da tela
        pos.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        target.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

        const onMouseMove = (e: MouseEvent) => {
            target.current = { x: e.clientX, y: e.clientY };
        };

        // Lerp (interpolação linear) — suaviza o movimento
        const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

        const animate = () => {
            pos.current.x = lerp(pos.current.x, target.current.x, 0.07);
            pos.current.y = lerp(pos.current.y, target.current.y, 0.07);

            if (orbRef.current) {
                orbRef.current.style.transform =
                    `translate(${pos.current.x - 300}px, ${pos.current.y - 300}px)`;
            }
            raf.current = requestAnimationFrame(animate);
        };

        window.addEventListener('mousemove', onMouseMove, { passive: true });
        raf.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            cancelAnimationFrame(raf.current);
        };
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
            {/* Gradiente de fundo base — Protege dark navy */}
            <div className="absolute inset-0 bg-[#02121f]" />

            {/* Vinheta de profundidade */}
            <div
                className="absolute inset-0"
                style={{
                    background:
                        'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(2,18,31,0.85) 100%)',
                }}
            />

            {/* ── Orb principal que segue o mouse ── */}
            <div
                ref={orbRef}
                className="absolute top-0 left-0 will-change-transform"
                style={{
                    width: 600,
                    height: 600,
                    borderRadius: '50%',
                    background:
                        'radial-gradient(circle, rgba(4,49,84,0.65) 0%, rgba(4,49,84,0.2) 45%, transparent 70%)',
                    filter: 'blur(40px)',
                }}
            />

            {/* Reflexo dourado que segue com leve delay (decorativo) */}
            <motion.div
                className="absolute"
                style={{
                    width: 400,
                    height: 400,
                    borderRadius: '50%',
                    background:
                        'radial-gradient(circle, rgba(149,121,60,0.18) 0%, rgba(149,121,60,0.05) 50%, transparent 70%)',
                    filter: 'blur(60px)',
                    top: '60%',
                    left: '70%',
                    translateX: '-50%',
                    translateY: '-50%',
                }}
                animate={{
                    x: [0, 40, -20, 0],
                    y: [0, -30, 20, 0],
                }}
                transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Orb fixo azul inferior esquerdo */}
            <motion.div
                className="absolute"
                style={{
                    width: 500,
                    height: 500,
                    borderRadius: '50%',
                    background:
                        'radial-gradient(circle, rgba(4,49,84,0.35) 0%, transparent 70%)',
                    filter: 'blur(80px)',
                    bottom: '-10%',
                    left: '-5%',
                }}
                animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.9, 0.6] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* ── Grid de pontos sutil ── */}
            <div
                className="absolute inset-0 opacity-[0.035]"
                style={{
                    backgroundImage:
                        'radial-gradient(circle, rgba(149,121,60,0.9) 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                }}
            />

            {/* ── Partículas flutuantes (dourado) ── */}
            {[...Array(6)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full"
                    style={{
                        width: Math.random() * 3 + 1,
                        height: Math.random() * 3 + 1,
                        background: '#95793c',
                        left: `${10 + i * 15}%`,
                        top: `${20 + (i % 3) * 25}%`,
                        opacity: 0,
                    }}
                    animate={{
                        y: [0, -60, 0],
                        opacity: [0, 0.6, 0],
                        x: [0, (i % 2 === 0 ? 1 : -1) * 20, 0],
                    }}
                    transition={{
                        duration: 5 + i * 1.5,
                        repeat: Infinity,
                        delay: i * 0.8,
                        ease: 'easeInOut',
                    }}
                />
            ))}

            {/* ── Linha decorativa de gradiente no topo ── */}
            <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{
                    background:
                        'linear-gradient(90deg, transparent, rgba(149,121,60,0.5), rgba(4,49,84,0.8), rgba(149,121,60,0.5), transparent)',
                }}
            />

            {/* ── Linha decorativa de gradiente na base ── */}
            <div
                className="absolute bottom-0 left-0 right-0 h-px"
                style={{
                    background:
                        'linear-gradient(90deg, transparent, rgba(4,49,84,0.5), transparent)',
                }}
            />
        </div>
    );
}
