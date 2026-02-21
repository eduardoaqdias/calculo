'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    TrendingUp,
    Calendar,
    MapPin,
    ChevronRight,
    ShieldAlert,
    Mail,
    PhoneCall,
    Target
} from 'lucide-react';
import Link from 'next/link';
import { obterSessao } from '@/lib/auth';

export default function DashboardSalesPage() {
    const [nome, setNome] = useState('');
    const [horaStr, setHoraStr] = useState('');

    useEffect(() => {
        const s = obterSessao();
        if (s) setNome(s.nome.split(' ')[0]);

        const h = new Date().getHours();
        if (h < 12) setHoraStr('Bom dia');
        else if (h < 18) setHoraStr('Boa tarde');
        else setHoraStr('Boa noite');
    }, []);

    const sessoesDeHoje = [
        { cliente: 'Supermercado Nova Era', tipo: 'Visita Presencial', horario: '10:30', status: 'Em breve', id: 'cli-001' },
        { cliente: 'Posto Graal', tipo: 'Acompanhamento', horario: '15:00', status: 'Atrasado', id: 'cli-003' }
    ];

    const pipelineMetricas = [
        { label: 'Fechado/Ganho', valor: 'R$ 120k', meta: '80%' },
        { label: 'Em Negociação', valor: 'R$ 450k', meta: '---' },
        { label: 'Prospecções Ativas', valor: '12', meta: '+2 esta semana' }
    ];

    return (
        <div className="max-w-4xl mx-auto pb-10 space-y-8">
            {/* Boas-vindas Header */}
            <div>
                <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-foreground mb-1">
                    {horaStr}, {nome || 'Executivo'}! 👋
                </h1>
                <p className="text-muted font-medium flex items-center gap-2">
                    <Target size={16} className="text-brand-500" />
                    Você tem <strong className="text-foreground">2 visitas</strong> e <strong className="text-foreground">5 follow-ups</strong> para hoje.
                </p>
            </div>

            {/* Grid Principal */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Coluna 1 & 2: Agenda e Rotinas */}
                <div className="md:col-span-2 space-y-6">

                    {/* Próximo Compromisso (Highlight) */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="bg-brand-500/10 border border-brand-500/30 rounded-3xl p-6 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-40 h-40 bg-brand-500/20 rounded-full blur-3xl -mr-10 -mt-10" />

                        <div className="flex items-start justify-between relative z-10 mb-4">
                            <div>
                                <span className="inline-block px-3 py-1 bg-brand-500 text-white text-[10px] font-black uppercase tracking-widest rounded-md mb-3 shadow-[0_4px_10px_rgba(255,102,0,0.3)]">
                                    Agora / Próximo
                                </span>
                                <h2 className="text-2xl font-black tracking-tight mb-1">Supermercado Nova Era</h2>
                                <p className="text-sm font-medium text-foreground/80 flex items-center gap-1.5">
                                    <MapPin size={14} className="text-brand-500" /> Av. Paulista, 1000 - São Paulo, SP
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-black tracking-tight text-brand-500">10:30</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 relative z-10 mt-6 md:mt-10">
                            <Link href="/clientes/cli-001" className="flex-1 md:flex-none">
                                <button className="w-full md:w-auto bg-brand-500 hover:bg-brand-600 text-white px-5 py-3 rounded-xl text-sm font-bold transition-all shadow-[0_4px_15px_rgba(255,102,0,0.3)] hover:shadow-[0_6px_20px_rgba(255,102,0,0.4)] active:scale-[0.98]">
                                    Abrir Ficha 360
                                </button>
                            </Link>
                            <button className="flex-1 md:flex-none bg-background/80 hover:bg-background text-foreground border border-border/50 px-5 py-3 rounded-xl text-sm font-bold transition-all backdrop-blur-sm active:scale-[0.98]">
                                Check-in Rápido
                            </button>
                        </div>
                    </motion.div>

                    {/* Resumo da Agenda */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold tracking-tight flex items-center gap-2">
                                <Calendar size={18} className="text-muted" /> Rota de Hoje
                            </h2>
                            <button className="text-[10px] font-bold text-brand-500 uppercase tracking-widest hover:underline">
                                Ver Completa
                            </button>
                        </div>

                        <div className="space-y-3">
                            {sessoesDeHoje.map((sessao, i) => (
                                <Link href={`/clientes/${sessao.id}`} key={i}>
                                    <div className="group bg-card border border-border/50 rounded-2xl p-4 flex items-center justify-between transition-all hover:border-brand-500/30 hover:shadow-sm active:scale-[0.99] mb-3">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-foreground/5 flex flex-col items-center justify-center">
                                                <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Hora</span>
                                                <span className="text-sm font-black text-foreground">{sessao.horario}</span>
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm text-foreground">{sessao.cliente}</p>
                                                <p className="text-xs font-medium text-muted">{sessao.tipo}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md hidden sm:inline-block ${sessao.status === 'Em breve' ? 'bg-blue-500/10 text-blue-500' :
                                                    'bg-red-500/10 text-red-500'
                                                }`}>
                                                {sessao.status}
                                            </span>
                                            <ChevronRight size={18} className="text-muted/50 group-hover:text-brand-500 transition-colors" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Coluna 3: Métricas e Ações Rápidas */}
                <div className="space-y-6">

                    {/* Painel de Resultados */}
                    <div className="bg-card border border-border/50 rounded-3xl p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <TrendingUp size={18} className="text-muted" />
                            <h2 className="text-base font-bold tracking-tight">Pipeline do Mês</h2>
                        </div>

                        <div className="space-y-5">
                            {pipelineMetricas.map((metrica, i) => (
                                <div key={i} className="flex flex-col justify-center">
                                    <span className="text-xs font-bold text-muted uppercase tracking-wider mb-0.5">{metrica.label}</span>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-2xl font-black tracking-tighter text-foreground">{metrica.valor}</span>
                                        <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded">{metrica.meta}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Ações Rápidas (Pipedrive/M365 Mocks) */}
                    <div className="bg-card border border-border/50 rounded-3xl p-6">
                        <h2 className="text-sm font-bold tracking-tight mb-4 text-muted uppercase">Tarefas Ágeis</h2>
                        <div className="space-y-2">
                            <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-foreground/5 transition-colors border border-transparent hover:border-border/50 text-left group">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                                        <Mail size={16} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-xs">Responder Follow-ups</p>
                                        <p className="text-[10px] text-muted font-medium">3 e-mails urgentes</p>
                                    </div>
                                </div>
                                <ChevronRight size={14} className="text-muted/50 group-hover:text-foreground" />
                            </button>

                            <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-foreground/5 transition-colors border border-transparent hover:border-border/50 text-left group">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500">
                                        <PhoneCall size={16} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-xs">Ligar para Prospects</p>
                                        <p className="text-[10px] text-muted font-medium">2 ligações pendentes</p>
                                    </div>
                                </div>
                                <ChevronRight size={14} className="text-muted/50 group-hover:text-foreground" />
                            </button>

                            <Link href="/catalogo">
                                <button className="mt-2 w-full flex items-center justify-between p-3 rounded-xl hover:bg-brand-500/5 transition-colors border border-brand-500/20 text-left group cursor-pointer block">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center text-brand-500">
                                            <ShieldAlert size={16} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-xs text-brand-500">Estudar Munições</p>
                                            <p className="text-[10px] text-brand-500/70 font-medium">Catálogo de Produtos</p>
                                        </div>
                                    </div>
                                    <ChevronRight size={14} className="text-brand-500/50 group-hover:text-brand-500" />
                                </button>
                            </Link>

                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}
