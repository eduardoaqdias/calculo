'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { LayoutDashboard, Users, ShieldAlert } from 'lucide-react';

const mobileNavItems = [
    { href: '/dashboard', label: 'Hoje', icone: LayoutDashboard },
    { href: '/clientes', label: 'Carteira', icone: Users },
    { href: '/catalogo', label: 'Soluções', icone: ShieldAlert },
];

export default function BottomNav() {
    const pathname = usePathname();

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.2)]">
            <nav className="flex items-center justify-around px-2 h-16">
                {mobileNavItems.map(item => {
                    const ativo = pathname === item.href || pathname?.startsWith(item.href + '/');
                    return (
                        <Link key={item.href} href={item.href} className="flex-1 cursor-pointer">
                            <button className="w-full flex flex-col items-center justify-center gap-1.5 py-2 relative cursor-pointer">
                                {ativo && (
                                    <motion.div
                                        layoutId="mobile-active-pill"
                                        className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-8 h-0.5 bg-brand-600 dark:bg-brand-500 rounded-b-full shadow-[0_2px_8px_rgba(255,102,0,0.8)]"
                                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                    />
                                )}
                                <item.icone
                                    size={24}
                                    className={`${ativo ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400 dark:text-slate-500'} transition-colors duration-300`}
                                />
                                <span
                                    className={`text-[10px] font-bold tracking-wide transition-colors duration-300 ${ativo ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400 dark:text-slate-500'
                                        }`}
                                >
                                    {item.label}
                                </span>
                            </button>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
