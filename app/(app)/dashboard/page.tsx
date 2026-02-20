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
    brand: 'bg-brand-500/10 border-brand-500/20 text-brand-400',
    purple: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
    green: 'bg-green-500/10 border-green-500/20 text-green-400',
    orange: 'bg-orange-500/10 border-orange-500/20 text-orange-400',
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
        <div className="p-6 md:p-8 max-w-6xl mx-auto">
            {/* Cabeçalho de boas-vindas */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                    {hora}, {nome || 'bem-vindo'}! 👋
                </h1>
                <p className="text-slate-400 mt-1 text-sm">
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
                className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
            >
                {kpis.map((kpi) => (
                    <motion.div
                        key={kpi.label}
                        variants={itemVar}
                        whileHover={{ y: -2, transition: { duration: 0.2 } }}
                        className="relative rounded-2xl border border-white/8 bg-white/[0.02] backdrop-blur-xl p-5 overflow-hidden"
                    >
                        {/* Ícone */}
                        <div className={`inline-flex p-2.5 rounded-xl border mb-3 ${corKpi[kpi.cor]}`}>
                            <kpi.icone size={18} />
                        </div>

                        {/* Valor */}
                        <div className="text-2xl font-bold text-white mb-0.5">{kpi.valor}</div>
                        <div className="text-xs text-slate-500 mb-1">{kpi.label}</div>
                        <div className={`text-xs font-medium ${kpi.positivo ? 'text-green-400' : 'text-red-400'}`}>
                            {kpi.variacao}
                        </div>

                        {/* Glow sutil de fundo */}
                        <div className={`absolute -right-4 -bottom-4 w-20 h-20 rounded-full opacity-5 ${kpi.cor === 'brand' ? 'bg-brand-500' :
                                kpi.cor === 'purple' ? 'bg-purple-500' :
                                    kpi.cor === 'green' ? 'bg-green-500' : 'bg-orange-500'
                            }`} />
                    </motion.div>
                ))}
            </motion.div>

            {/* Grid de conteúdo principal */}
            <div className="grid md:grid-cols-3 gap-5">
                {/* Acesso rápido ao Simulador CPE */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="md:col-span-2"
                >
                    <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-6 h-full">
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <h2 className="text-base font-semibold text-white">Simulador CPE</h2>
                                <p className="text-xs text-slate-500 mt-0.5">Calcule custos e gere orçamentos</p>
                            </div>
                            <span className="text-xs px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400">
                                Disponível
                            </span>
                        </div>

                        <div className="space-y-3 mb-6">
                            {[
                                'Seleção em cascata por Cidade, Base, UF e Rota',
                                'Cálculo automático de impostos (ISS, PIS/COFINS, ICMS)',
                                'Exportação de orçamento via e-mail',
                                'Suporte a margem de lucro configurável',
                            ].map((f, i) => (
                                <div key={i} className="flex items-start gap-2.5">
                                    <CheckCircle size={15} className="text-brand-400 flex-shrink-0 mt-0.5" />
                                    <span className="text-sm text-slate-400">{f}</span>
                                </div>
                            ))}
                        </div>

                        <Link href="/simulador">
                            <motion.div
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold transition-all cursor-pointer shadow-lg shadow-brand-500/20"
                            >
                                <Calculator size={16} />
                                Abrir Simulador
                                <ArrowUpRight size={15} />
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
                    <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-6 h-full">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-base font-semibold text-white">Atividade Recente</h2>
                            <Clock size={14} className="text-slate-500" />
                        </div>

                        <div className="space-y-4">
                            {atividades.map((a, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.45 + i * 0.06 }}
                                    className="flex items-start gap-3"
                                >
                                    {a.status === 'ok' ? (
                                        <CheckCircle size={14} className="text-green-400 flex-shrink-0 mt-0.5" />
                                    ) : (
                                        <AlertCircle size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
                                    )}
                                    <div>
                                        <p className="text-xs text-slate-300 leading-relaxed">{a.texto}</p>
                                        <p className="text-xs text-slate-600 mt-0.5">{a.tempo}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <button className="mt-5 text-xs text-brand-400 hover:text-brand-300 transition-colors flex items-center gap-1">
                            Ver todo histórico <ChevronRight size={12} />
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Status do sistema */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-5 rounded-2xl border border-white/6 bg-white/[0.01] px-5 py-3 flex flex-wrap items-center gap-x-6 gap-y-2"
            >
                <span className="text-xs text-slate-600 font-medium">Status do sistema</span>
                {[
                    { label: 'Banco CPE', ok: true },
                    { label: 'Autenticação', ok: true },
                    { label: 'API', ok: true },
                ].map(s => (
                    <div key={s.label} className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${s.ok ? 'bg-green-400' : 'bg-red-400'} animate-pulse-slow`} />
                        <span className="text-xs text-slate-500">{s.label}</span>
                    </div>
                ))}
                <div className="ml-auto text-xs text-slate-700 font-mono">
                    v2.0.0 · {new Date().toLocaleDateString('pt-BR')}
                </div>
            </motion.div>
        </div>
    );
}
