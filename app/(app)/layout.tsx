'use client';

/**
 * Layout protegido do App — verifica sessão client-side
 * Sidebar fixa (desktop) e navegação mobile
 */

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Users,
    ShieldAlert,
    LogOut,
    Bell,
    Settings
} from 'lucide-react';
import { obterSessao, encerrarSessao, SessaoUsuario } from '@/lib/auth';
import ThemeToggle from '@/components/ui/ThemeToggle';
import BottomNav from '@/components/ui/BottomNav';

const navItems = [
    { href: '/dashboard', label: 'Briefing do Dia', icone: LayoutDashboard },
    { href: '/clientes', label: 'Minha Carteira', icone: Users },
    { href: '/catalogo', label: 'Catálogo de Soluções', icone: ShieldAlert },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [sessao, setSessao] = useState<SessaoUsuario | null>(null);
    const [menuAberto, setMenuAberto] = useState(false);
    const [carregando, setCarregando] = useState(true);

    // Verifica autenticação
    useEffect(() => {
        const s = obterSessao();
        if (!s) {
            router.replace('/login');
            return;
        }
        setSessao(s);
        setCarregando(false);
    }, [router]);

    function handleLogout() {
        encerrarSessao();
        router.push('/login');
    }

    if (carregando) {
        return (
            <div className="min-h-[100dvh] flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                    className="w-8 h-8 rounded-full border-2 border-brand-200 dark:border-brand-900/50 border-t-brand-600 dark:border-t-brand-500"
                />
            </div>
        );
    }

    // Iniciais do avatar
    const iniciais = sessao?.nome.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase() ?? 'U';

    return (
        <div className="min-h-[100dvh] bg-slate-50 dark:bg-slate-950 flex text-slate-900 dark:text-slate-50 font-sans selection:bg-brand-500/30 selection:text-brand-900 dark:selection:text-brand-100">
            {/* ---- SIDEBAR DESKTOP ---- */}
            <motion.aside
                initial={{ x: -80, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="hidden lg:flex flex-col w-72 border-r border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 z-40 relative shadow-sm"
            >
                {/* Logo */}
                <div className="p-8 pb-6 border-b border-transparent">
                    <div className="flex items-center gap-4 group cursor-pointer">
                        <div className="relative">
                            <div className="relative w-11 h-11 rounded-xl bg-brand-50 dark:bg-brand-900/40 border border-brand-100 dark:border-brand-800 flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 group-hover:shadow-sm">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src="https://www.protege.com.br/media/ovmn4be5/main-logo.svg"
                                    alt="Protege"
                                    className="h-5 w-auto dark:filter dark:brightness-0 dark:invert transition-all"
                                />
                            </div>
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-slate-50 leading-tight font-display">PROTEGE</p>
                            <p className="text-[10px] text-brand-600 dark:text-brand-400 font-bold uppercase tracking-[0.2em] mt-0.5">SALES APP</p>
                        </div>
                    </div>
                </div>

                {/* Navegação */}
                <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
                    <p className="px-4 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">Navegação Principal</p>
                    {navItems.map(item => {
                        const ativo = pathname === item.href || pathname?.startsWith(item.href + '/');
                        return (
                            <Link key={item.href} href={item.href}>
                                <motion.div
                                    whileTap={{ scale: 0.98 }}
                                    className={`relative flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer overflow-hidden group ${ativo
                                        ? 'text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800/50'
                                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-800'
                                        }`}
                                >
                                    {ativo && (
                                        <motion.div
                                            layoutId="active-pill"
                                            className="absolute left-0 w-1 h-5 bg-brand-600 dark:bg-brand-500 rounded-r-md"
                                        />
                                    )}
                                    <item.icone size={18} className={`${ativo ? 'text-brand-600 dark:text-brand-500' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'} transition-colors`} />
                                    {item.label}
                                </motion.div>
                            </Link>
                        );
                    })}
                </nav>

                {/* Perfil + Theme + Logout */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 m-4 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-3 px-2 mb-4">
                        <div className="relative group cursor-pointer">
                            <div className="relative w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center text-[12px] font-bold text-brand-700 dark:text-brand-400 flex-shrink-0 group-hover:bg-brand-50 dark:group-hover:bg-brand-900/50 transition-colors">
                                {iniciais}
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-900 dark:text-slate-50 truncate tracking-tight">{sessao?.nome}</p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate font-semibold uppercase tracking-wider">Executivo Comercial</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between px-2 pt-2 border-t border-slate-200 dark:border-slate-800/80">
                        <ThemeToggle />
                        <button
                            onClick={handleLogout}
                            title="Encerrar Sessão"
                            className="p-2 rounded-lg text-slate-400 dark:text-slate-500 border border-transparent hover:border-red-200 dark:hover:border-red-900/50 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all cursor-pointer"
                        >
                            <LogOut size={16} />
                        </button>
                    </div>
                </div>
            </motion.aside>

            {/* ---- HEADER MOBILE ---- */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 h-16 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-900/20 border border-brand-100 dark:border-brand-800/50 flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="https://www.protege.com.br/media/ovmn4be5/main-logo.svg"
                            alt="Protege"
                            className="h-4 w-auto dark:filter dark:brightness-0 dark:invert transition-all"
                        />
                    </div>
                    <span className="font-extrabold tracking-tight text-sm font-display leading-none text-slate-900 dark:text-slate-50 pt-0.5">SALES APP</span>
                </div>
                <div className="flex items-center gap-2">
                    <ThemeToggle />
                </div>
            </div>

            {/* ---- CONTEÚDO PRINCIPAL ---- */}
            <main className="flex-1 flex flex-col md:h-screen lg:overflow-y-auto">
                {/* Topbar desktop */}
                <div className="hidden lg:flex items-center justify-between px-8 h-20 border-b border-slate-200 dark:border-slate-800 sticky top-0 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl z-30 shadow-sm">
                    <div className="flex items-center gap-3">
                        {navItems.find(n => n.href === pathname) && (
                            <>
                                {(() => {
                                    const item = navItems.find(n => n.href === pathname);
                                    if (!item) return null;
                                    const Ico = item.icone;
                                    return (
                                        <>
                                            <div className="p-2 rounded-xl bg-brand-50 dark:bg-brand-900/20 border border-brand-100 dark:border-brand-800/50">
                                                <Ico size={18} className="text-brand-600 dark:text-brand-400" />
                                            </div>
                                            <span className="text-lg font-bold text-slate-900 dark:text-slate-50 font-display tracking-tight">{item.label}</span>
                                        </>
                                    );
                                })()}
                            </>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="relative text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50 transition-colors p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer">
                            <Settings size={18} />
                        </button>
                        <button className="relative text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50 transition-colors p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer">
                            <Bell size={18} />
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-brand-500 shadow-sm" />
                        </button>
                    </div>
                </div>

                {/* Área de conteúdo */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className="flex-1 py-20 lg:py-10 px-4 md:px-8 lg:px-12 w-full max-w-7xl mx-auto"
                >
                    {children}
                </motion.div>
            </main>

            {/* ---- BOTTOM MENU MOBILE ---- */}
            <BottomNav />
        </div>
    );
}
