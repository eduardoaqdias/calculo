'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Users, Filter, Plus, ChevronRight, Phone, Navigation } from 'lucide-react';
import Link from 'next/link';
import { CLIENTES_MOCK, StatusCliente } from '@/lib/mocks/clientes';

export default function CarteiraPage() {
    const [busca, setBusca] = useState('');
    const [statusFiltro, setStatusFiltro] = useState<StatusCliente | 'Todos'>('Todos');

    const clientesFiltrados = CLIENTES_MOCK.filter(c => {
        const matchBusca = c.nomeFantasia.toLowerCase().includes(busca.toLowerCase()) ||
            c.razaoSocial.toLowerCase().includes(busca.toLowerCase()) ||
            c.segmento.toLowerCase().includes(busca.toLowerCase());
        const matchStatus = statusFiltro === 'Todos' || c.status === statusFiltro;
        return matchBusca && matchStatus;
    });

    const counts = {
        Total: CLIENTES_MOCK.length,
        Ativos: CLIENTES_MOCK.filter(c => c.status === 'Ativo').length,
        Prospects: CLIENTES_MOCK.filter(c => c.status === 'Prospect').length,
        Risco: CLIENTES_MOCK.filter(c => c.status === 'Em Risco').length,
    };

    return (
        <div className="max-w-4xl mx-auto pb-10">
            {/* Header com Ações */}
            <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tighter flex items-center gap-3">
                        Minha Carteira
                        <Users className="text-brand-500 w-8 h-8" />
                    </h1>
                    <p className="text-muted mt-2 text-sm md:text-base">
                        Gestão ágil de clientes e prospecção em rota.
                    </p>
                </div>

                <button className="flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-5 py-3 rounded-xl font-bold transition-all active:scale-95 shadow-[0_8px_20px_rgba(255,102,0,0.3)] w-full md:w-auto">
                    <Plus size={18} />
                    Novo Prospect
                </button>
            </div>

            {/* Micro-Dashboard de Status */}
            <div className="grid grid-cols-4 gap-2 mb-8">
                {[
                    { label: 'Todos', count: counts.Total, val: 'Todos' },
                    { label: 'Ativos', count: counts.Ativos, val: 'Ativo', color: 'text-green-500' },
                    { label: 'Prospects', count: counts.Prospects, val: 'Prospect', color: 'text-blue-500' },
                    { label: 'Risco', count: counts.Risco, val: 'Em Risco', color: 'text-red-500' },
                ].map((stat, i) => (
                    <div
                        key={i}
                        onClick={() => setStatusFiltro(stat.val as any)}
                        className={`bg-card border ${statusFiltro === stat.val ? 'border-brand-500 shadow-[0_0_15px_rgba(255,102,0,0.1)]' : 'border-border/50'} rounded-2xl p-3 flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-foreground/5`}
                    >
                        <span className={`text-xl font-black ${stat.color || 'text-foreground'}`}>{stat.count}</span>
                        <span className="text-[10px] font-bold text-muted uppercase tracking-widest mt-1 text-center">{stat.label}</span>
                    </div>
                ))}
            </div>

            {/* Busca */}
            <div className="sticky top-14 z-20 bg-background/95 backdrop-blur-xl py-4 -mx-4 px-4 md:mx-0 md:px-0 md:top-0 md:relative md:py-0 md:mb-6">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-muted/60" />
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar por nome, razão social ou segmento..."
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        className="block w-full pl-10 pr-4 py-3 bg-card border border-border/50 rounded-2xl text-sm shadow-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all placeholder:text-muted/50 font-medium"
                    />
                </div>
            </div>

            {/* Lista de Clientes */}
            <AnimatePresence mode="popLayout">
                <div className="space-y-3">
                    {clientesFiltrados.length === 0 ? (
                        <div className="py-12 text-center text-muted bg-card border border-border/50 rounded-2xl">
                            <Users className="w-12 h-12 text-muted/30 mx-auto mb-3" />
                            <p className="font-medium">Nenhum cliente encontrado.</p>
                        </div>
                    ) : (
                        clientesFiltrados.map((cliente) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                key={cliente.id}
                            >
                                <Link href={`/clientes/${cliente.id}`}>
                                    <div className="group bg-card border border-border/50 rounded-2xl p-4 transition-all hover:border-brand-500/30 hover:shadow-[0_8px_30px_rgba(255,102,0,0.08)] active:scale-[0.98] flex flex-col sm:flex-row gap-4 sm:items-center justify-between relative overflow-hidden">

                                        {/* Status Line Indicator */}
                                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${cliente.status === 'Ativo' ? 'bg-green-500' :
                                                cliente.status === 'Prospect' ? 'bg-blue-500' :
                                                    cliente.status === 'Em Risco' ? 'bg-red-500' : 'bg-muted'
                                            }`} />

                                        <div className="flex-1 pl-2">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-black text-lg tracking-tight text-foreground">{cliente.nomeFantasia}</h3>
                                                <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${cliente.status === 'Ativo' ? 'bg-green-500/10 text-green-500' :
                                                        cliente.status === 'Prospect' ? 'bg-blue-500/10 text-blue-500' :
                                                            cliente.status === 'Em Risco' ? 'bg-red-500/10 text-red-500' : 'bg-muted/10 text-muted'
                                                    }`}>
                                                    {cliente.status}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-1.5 text-xs text-muted mb-3 font-medium">
                                                <MapPin size={12} className="text-brand-500/70" />
                                                <span className="truncate max-w-[200px] md:max-w-xs">{cliente.endereco}</span>
                                            </div>

                                            <div className="flex flex-wrap gap-2 text-xs">
                                                <span className="bg-foreground/5 text-foreground/80 px-2 py-1 rounded-md font-medium">{cliente.segmento}</span>
                                                {cliente.oportunidadesCrossSell.length > 0 && (
                                                    <span className="bg-brand-500/10 text-brand-500 px-2 py-1 rounded-md font-bold flex items-center gap-1">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
                                                        Upsell Disponível
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between sm:justify-end gap-3 border-t border-border/50 sm:border-none pt-3 sm:pt-0">
                                            <div className="flex gap-2">
                                                <button onClick={(e) => { e.preventDefault(); /* Integrar Tel */ }} className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center text-foreground hover:bg-brand-500 hover:text-white transition-colors">
                                                    <Phone size={16} />
                                                </button>
                                                <button onClick={(e) => { e.preventDefault(); /* Integrar Maps */ }} className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center text-foreground hover:bg-brand-500 hover:text-white transition-colors">
                                                    <Navigation size={16} />
                                                </button>
                                            </div>
                                            <ChevronRight className="text-muted/40 group-hover:text-brand-500 transition-colors" />
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))
                    )}
                </div>
            </AnimatePresence>
        </div>
    );
}
