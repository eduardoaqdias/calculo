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
    Calculator,
    LogOut,
    Menu,
    X,
    ChevronRight,
    Bell,
} from 'lucide-react';
import { obterSessao, encerrarSessao, SessaoUsuario } from '@/lib/auth';
import ThemeToggle from '@/components/ui/ThemeToggle';

const navItems = [
    { href: '/dashboard', label: 'Dashboard', icone: LayoutDashboard },
    { href: '/simulador', label: 'Simulador CPE', icone: Calculator },
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
            <div className="min-h-screen flex items-center justify-center bg-background">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                    className="w-8 h-8 rounded-full border-2 border-brand-500/30 border-t-brand-500"
                />
            </div>
        );
    }

    // Iniciais do avatar
    const iniciais = sessao?.nome.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase() ?? 'U';

    return (
        <div className="min-h-screen bg-background flex text-foreground">
            {/* ---- SIDEBAR DESKTOP ---- */}
            <motion.aside
                initial={{ x: -80, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="hidden md:flex flex-col w-64 border-r border-border bg-card/50 backdrop-blur-xl"
            >
                {/* Logo */}
                <div className="p-6 border-b border-border">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center flex-shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="https://www.protege.com.br/media/ovmn4be5/main-logo.svg"
                                alt="Protege"
                                className="h-4 w-auto dark:filter dark:brightness-0 dark:invert transition-all"
                            />
                        </div>
                        <div>
                            <p className="text-sm font-bold">Protege</p>
                            <p className="text-xs text-muted">Plataforma Corporativa</p>
                        </div>
                    </div>
                </div>

                {/* Navegação */}
                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map(item => {
                        const ativo = pathname === item.href || pathname?.startsWith(item.href + '/');
                        return (
                            <Link key={item.href} href={item.href}>
                                <motion.div
                                    whileHover={{ x: 3 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${ativo
                                        ? 'bg-brand-500/10 text-brand-500 dark:text-brand-400 border border-brand-500/20'
                                        : 'text-muted hover:text-foreground hover:bg-foreground/5'
                                        }`}
                                >
                                    <item.icone size={17} className={ativo ? 'text-brand-500 dark:text-brand-400' : ''} />
                                    {item.label}
                                    {ativo && (
                                        <ChevronRight size={14} className="ml-auto opacity-50" />
                                    )}
                                </motion.div>
                            </Link>
                        );
                    })}
                </nav>

                {/* Perfil + Theme + Logout */}
                <div className="p-4 border-t border-border space-y-4">
                    <div className="flex items-center gap-3 px-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                            {iniciais}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{sessao?.nome}</p>
                            <p className="text-xs text-muted truncate">{sessao?.email}</p>
                        </div>
                    </div>

                    <div className="px-3">
                        <ThemeToggle />
                    </div>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-muted hover:text-red-500 hover:bg-red-500/5 transition-all duration-200"
                    >
                        <LogOut size={15} />
                        Sair da plataforma
                    </button>
                </div>
            </motion.aside>

            {/* ---- HEADER MOBILE ---- */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 h-14 border-b border-border bg-background/80 backdrop-blur-xl">
                <div className="flex items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src="https://www.protege.com.br/media/ovmn4be5/main-logo.svg"
                        alt="Protege"
                        className="h-5 w-auto dark:filter dark:brightness-0 dark:invert transition-all"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <button
                        onClick={() => setMenuAberto(v => !v)}
                        className="p-2 text-muted hover:text-foreground transition-colors"
                    >
                        {menuAberto ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* Menu Mobile Overlay */}
            <AnimatePresence>
                {menuAberto && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="md:hidden fixed inset-y-0 right-0 z-50 w-72 bg-card/95 backdrop-blur-2xl border-l border-border p-6 flex flex-col shadow-2xl"
                    >
                        <div className="flex justify-between items-center mb-8">
                            <span className="text-sm font-bold">Menu</span>
                            <button onClick={() => setMenuAberto(false)} className="text-muted">
                                <X size={20} />
                            </button>
                        </div>
                        <nav className="space-y-2 flex-1">
                            {navItems.map(item => {
                                const ativo = pathname === item.href;
                                return (
                                    <Link key={item.href} href={item.href} onClick={() => setMenuAberto(false)}>
                                        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${ativo
                                            ? 'bg-brand-500/10 text-brand-500 dark:text-brand-400'
                                            : 'text-muted'
                                            }`}>
                                            <item.icone size={17} />
                                            {item.label}
                                        </div>
                                    </Link>
                                );
                            })}
                        </nav>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-red-500 hover:bg-red-500/5 transition-all"
                        >
                            <LogOut size={15} />
                            Sair
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ---- CONTEÚDO PRINCIPAL ---- */}
            <main className="flex-1 flex flex-col md:max-h-screen md:overflow-y-auto">
                {/* Topbar desktop */}
                <div className="hidden md:flex items-center justify-between px-8 h-16 border-b border-border sticky top-0 bg-background/80 backdrop-blur-xl z-30">
                    <div className="flex items-center gap-2">
                        {navItems.find(n => n.href === pathname) && (
                            <>
                                {(() => {
                                    const item = navItems.find(n => n.href === pathname);
                                    if (!item) return null;
                                    const Ico = item.icone;
                                    return (
                                        <>
                                            <Ico size={16} className="text-muted" />
                                            <span className="text-sm font-medium text-muted">{item.label}</span>
                                        </>
                                    );
                                })()}
                            </>
                        )}
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="relative text-muted hover:text-foreground transition-colors">
                            <Bell size={18} />
                            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-brand-500" />
                        </button>
                    </div>
                </div>

                {/* Área de conteúdo */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className="flex-1 md:p-0 pt-14 md:pt-0"
                >
                    {children}
                </motion.div>
            </main>
        </div>
    );
}
