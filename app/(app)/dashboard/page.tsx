'use client';

/**
 * Dashboard Corporativo — Protege Platform
 * Tela inicial com KPIs, acesso rápido e saudação personalizada
 */

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    Calculator, TrendingUp, MapPin, Package,
    ArrowUpRight, Clock, CheckCircle, AlertCircle, ChevronRight,
} from 'lucide-react';
import { obterSessao } from '@/lib/auth';

// KPI Cards do dashboard
const kpis = [
    {
        label: 'Simulações Realizadas',
        valor: '128',
        variacao: '+12%',
        positivo: true,
        icone: Calculator,
        cor: 'brand',
    },
    {
        label: 'Rotas Disponíveis',
        valor: '47',
        variacao: '+3 novas',
        positivo: true,
        icone: MapPin,
        cor: 'purple',
    },
    {
        label: 'Volume Estimado',
        valor: '2.840',
        variacao: '+8% vs mês anterior',
        positivo: true,
        icone: Package,
        cor: 'green',
    },
    {
        label: 'Economia Gerada',
        valor: 'R$ 48K',
        variacao: 'no trimestre',
        positivo: true,
        icone: TrendingUp,
        cor: 'orange',
    },
];

// Atividades recentes (dados de exemplo)
const atividades = [
    { status: 'ok', texto: 'Simulação CPE — SP / Rota Diurna concluída', tempo: '2 min atrás' },
    { status: 'ok', texto: 'Orçamento exportado — Cliente ACME Corp', tempo: '1h atrás' },
    { status: 'aviso', texto: 'Banco de dados CPE atualizado', tempo: '3h atrás' },
    { status: 'ok', texto: 'Simulação CPE — MG / Rota Noturna concluída', tempo: 'Hoje, 09:14' },
];

const corKpi: Record<string, string> = {
    brand: 'bg-brand-500/10 border-brand-500/20 text-brand-600 dark:text-brand-400',
    purple: 'bg-purple-500/10 border-purple-500/20 text-purple-600 dark:text-purple-400',
    green: 'bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400',
    orange: 'bg-orange-500/10 border-orange-500/20 text-orange-600 dark:text-orange-400',
};

const containerVar = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};

const itemVar = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 28 } },
};

export default function DashboardPage() {
    const [nome, setNome] = useState('');
    const [hora, setHora] = useState('');

    useEffect(() => {
        const s = obterSessao();
        if (s) setNome(s.nome.split(' ')[0]);

        // Saudação baseada no horário
        const h = new Date().getHours();
        if (h < 12) setHora('Bom dia');
        else if (h < 18) setHora('Boa tarde');
        else setHora('Boa noite');
    }, []);

    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8">
            {/* Cabeçalho de boas-vindas */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-2xl md:text-4xl font-extrabold text-foreground tracking-tight">
                    {hora}, {nome || 'bem-vindo'}! 👋
                </h1>
                <p className="text-muted mt-2 text-sm md:text-base font-medium">
                    {new Date().toLocaleDateString('pt-BR', {
                        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
                    })}
                </p>
            </motion.div>

            {/* KPI Cards */}
            <motion.div
                variants={containerVar}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8"
            >
                {kpis.map((kpi) => (
                    <motion.div
                        key={kpi.label}
                        variants={itemVar}
                        whileHover={{ y: -4, transition: { duration: 0.2 } }}
                        className="relative rounded-2xl border border-border bg-card shadow-sm dark:shadow-none p-4 md:p-6 overflow-hidden transition-all hover:shadow-md dark:hover:bg-foreground/5"
                    >
                        {/* Ícone */}
                        <div className={`inline-flex p-3 rounded-xl border mb-4 ${corKpi[kpi.cor]}`}>
                            <kpi.icone size={20} />
                        </div>

                        {/* Valor */}
                        <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">{kpi.valor}</div>
                        <div className="text-xs md:text-sm text-muted mb-2 font-medium">{kpi.label}</div>
                        <div className={`text-xs font-bold px-2 py-0.5 rounded-full inline-block ${kpi.positivo ? 'bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-red-500/10 text-red-600 dark:text-red-400'}`}>
                            {kpi.variacao}
                        </div>

                        {/* Glow sutil de fundo */}
                        <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-[0.03] dark:opacity-[0.05] ${kpi.cor === 'brand' ? 'bg-brand-500' :
                            kpi.cor === 'purple' ? 'bg-purple-500' :
                                kpi.cor === 'green' ? 'bg-green-500' : 'bg-orange-500'
                            }`} />
                    </motion.div>
                ))}
            </motion.div>

            {/* Grid de conteúdo principal */}
            <div className="grid md:grid-cols-3 gap-6">
                {/* Acesso rápido ao Simulador CPE */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="md:col-span-2"
                >
                    <div className="rounded-2xl border border-border bg-card shadow-sm dark:shadow-none p-6 md:p-8 h-full flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-lg md:text-xl font-bold text-foreground">Simulador CPE</h2>
                                <p className="text-sm text-muted mt-1 font-medium">Calcule custos e gere orçamentos</p>
                            </div>
                            <span className="text-xs px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 font-bold">
                                Ativo
                            </span>
                        </div>

                        <div className="space-y-4 mb-8 flex-1">
                            {[
                                'Seleção em cascata por Cidade, Base, UF e Rota',
                                'Cálculo automático de impostos (ISS, PIS/COFINS, ICMS)',
                                'Exportação de orçamento via e-mail',
                                'Suporte a margem de lucro configurável',
                            ].map((f, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <CheckCircle size={16} className="text-brand-500 dark:text-brand-400 flex-shrink-0 mt-0.5" />
                                    <span className="text-sm md:text-base text-muted font-medium">{f}</span>
                                </div>
                            ))}
                        </div>

                        <Link href="/simulador">
                            <motion.div
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                className="flex items-center justify-center gap-3 w-full py-4 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-base font-bold transition-all cursor-pointer shadow-lg shadow-brand-500/25 dark:shadow-none"
                            >
                                <Calculator size={20} />
                                Abrir Simulador
                                <ArrowUpRight size={18} />
                            </motion.div>
                        </Link>
                    </div>
                </motion.div>

                {/* Atividade recente */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <div className="rounded-2xl border border-border bg-card shadow-sm dark:shadow-none p-6 md:p-8 h-full flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-base md:text-lg font-bold text-foreground">Atividade Recente</h2>
                            <Clock size={16} className="text-muted" />
                        </div>

                        <div className="space-y-6 flex-1">
                            {atividades.map((a, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.45 + i * 0.06 }}
                                    className="flex items-start gap-4"
                                >
                                    <div className="mt-1">
                                        {a.status === 'ok' ? (
                                            <CheckCircle size={16} className="text-green-500 dark:text-green-400 flex-shrink-0" />
                                        ) : (
                                            <AlertCircle size={16} className="text-amber-500 dark:text-amber-400 flex-shrink-0" />
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm text-foreground/90 font-medium leading-tight">{a.texto}</p>
                                        <p className="text-xs text-muted mt-1.5 font-medium">{a.tempo}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <button className="mt-8 text-sm font-bold text-brand-500 dark:text-brand-400 hover:opacity-80 transition-all flex items-center justify-center gap-2 py-2 rounded-xl bg-foreground/5 md:bg-transparent">
                            Ver todo histórico <ChevronRight size={14} />
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Status do sistema */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="rounded-2xl border border-border bg-foreground/[0.02] px-6 py-4 flex flex-wrap items-center justify-center md:justify-start gap-x-8 gap-y-4"
            >
                <span className="text-xs text-muted font-bold uppercase tracking-wider">Status do sistema</span>
                <div className="flex flex-wrap items-center justify-center gap-6">
                    {[
                        { label: 'Banco CPE', ok: true },
                        { label: 'Autenticação', ok: true },
                        { label: 'API', ok: true },
                    ].map(s => (
                        <div key={s.label} className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${s.ok ? 'bg-green-500' : 'bg-red-500'} shadow-[0_0_8px_rgba(34,197,94,0.4)] animate-pulse`} />
                            <span className="text-sm text-foreground/70 font-medium">{s.label}</span>
                        </div>
                    ))}
                </div>
                <div className="md:ml-auto text-xs text-muted font-mono bg-foreground/5 px-3 py-1 rounded-full font-bold">
                    PLATAFORMA V2.0.0 · {new Date().toLocaleDateString('pt-BR')}
                </div>
            </motion.div>
        </div>
    );
}
