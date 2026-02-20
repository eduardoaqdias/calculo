'use client';

/**
 * app/page.tsx — Ponto de entrada raiz
 * Redireciona para /login se não autenticado ou /dashboard se autenticado
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { estaAutenticado } from '@/lib/auth';
import { motion } from 'framer-motion';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redireciona baseado no estado de autenticação
    if (estaAutenticado()) {
      router.replace('/dashboard');
    } else {
      router.replace('/login');
    }
  }, [router]);

  // Tela de carregamento durante o redirect
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#080d1a]">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
        className="w-8 h-8 rounded-full border-2 border-brand-500/30 border-t-brand-500 mb-4"
      />
      <p className="text-slate-600 text-sm">Carregando plataforma...</p>
    </div>
  );
}
