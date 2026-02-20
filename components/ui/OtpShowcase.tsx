'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, ShieldAlert } from 'lucide-react';

interface OtpShowcaseProps {
    otp: string;
    show: boolean;
}

export default function OtpShowcase({ otp, show }: OtpShowcaseProps) {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (copied) {
            const timer = setTimeout(() => setCopied(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [copied]);

    const handleCopy = () => {
        navigator.clipboard.writeText(otp);
        setCopied(true);
    };

    return (
        <AnimatePresence>
            {show && otp && (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-xs px-4"
                >
                    <div className="relative group overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl p-4">
                        {/* Glow effect */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-brand-500/0 via-brand-500/10 to-brand-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="relative flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400">
                                    <ShieldAlert size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Código de Acesso</p>
                                    <p className="text-2xl font-mono font-bold text-white tracking-[0.2em]">{otp}</p>
                                </div>
                            </div>

                            <button
                                onClick={handleCopy}
                                className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 ${copied
                                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                        : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                {copied ? <Check size={18} /> : <Copy size={18} />}
                            </button>
                        </div>

                        {/* Progress bar simulation for expiry feel */}
                        <div className="absolute bottom-0 left-0 h-[2px] bg-brand-500/30 w-full overflow-hidden">
                            <motion.div
                                initial={{ width: "100%" }}
                                animate={{ width: "0%" }}
                                transition={{ duration: 300, ease: "linear" }}
                                className="h-full bg-brand-500"
                            />
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
