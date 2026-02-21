'use client';

import { useState } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Phone, Mail, FileText, CheckCircle2, TrendingUp, AlertCircle, Briefcase, Plus, Mic, Users } from 'lucide-react';
import { PRODUTOS_MOCK } from '@/lib/mocks/produtos';

export default function ClienteDetalheClient({ cliente }: { cliente: any }) {
    const router = useRouter();
    const [gravando, setGravando] = useState(false);

    if (!cliente) return notFound();

    const produtosContratados = cliente.produtosContratados.map((id: string) => PRODUTOS_MOCK.find(p => p.id === id)).filter(Boolean);
    const oportunidades = cliente.oportunidadesCrossSell.map((id: string) => PRODUTOS_MOCK.find(p => p.id === id)).filter(Boolean);

    return (
        <div className="max-w-4xl mx-auto pb-24 md:pb-16 mt-4 md:mt-8 space-y-8">
            {/* Header / Botão Voltar */}
            <div className="sticky top-0 z-30 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl -mx-4 px-4 py-4 border-b border-slate-200 dark:border-slate-800 md:static md:bg-transparent md:border-none md:p-0 md:mx-0 flex items-center justify-between">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors group cursor-pointer"
                >
                    <ArrowLeft size={18} className="transform group-hover:-translate-x-1 transition-transform" />
                    Voltar à Carteira
                </button>
            </div>

            {/* Cabeçalho do Cliente */}
            <div>
                <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded shadow-sm ${cliente.status === 'Ativo' ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400' :
                        cliente.status === 'Prospect' ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400' :
                            cliente.status === 'Em Risco' ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400' :
                                'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}>
                        {cliente.status}
                    </span>
                    <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded shadow-sm">
                        {cliente.segmento}
                    </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 mb-2 font-display leading-tight">
                    {cliente.nomeFantasia}
                </h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium text-base">{cliente.razaoSocial} • CNPJ: {cliente.cnpj}</p>
            </div>

            {/* Quick Actions Baseadas em Fricção Zero */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
                <button className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-300 dark:hover:border-brand-700 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-all rounded-2xl p-4 flex flex-col items-center justify-center gap-3 group cursor-pointer shadow-sm">
                    <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 group-hover:bg-brand-100 dark:group-hover:bg-brand-900/40 flex items-center justify-center transition-colors">
                        <MapPin className="text-slate-400 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors" size={24} />
                    </div>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300 group-hover:text-brand-700 dark:group-hover:text-brand-400">Navegar</span>
                </button>
                <button className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-300 dark:hover:border-brand-700 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-all rounded-2xl p-4 flex flex-col items-center justify-center gap-3 group cursor-pointer shadow-sm">
                    <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 group-hover:bg-brand-100 dark:group-hover:bg-brand-900/40 flex items-center justify-center transition-colors">
                        <Phone className="text-slate-400 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors" size={24} />
                    </div>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300 group-hover:text-brand-700 dark:group-hover:text-brand-400">Ligar Contato</span>
                </button>
                <button className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-300 dark:hover:border-brand-700 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-all rounded-2xl p-4 flex flex-col items-center justify-center gap-3 group cursor-pointer shadow-sm">
                    <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 group-hover:bg-brand-100 dark:group-hover:bg-brand-900/40 flex items-center justify-center transition-colors">
                        <FileText className="text-slate-400 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors" size={24} />
                    </div>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300 group-hover:text-brand-700 dark:group-hover:text-brand-400 px-1 text-center">Enviar Portfólio</span>
                </button>
                <button
                    onClick={() => setGravando(!gravando)}
                    className={`transition-all rounded-2xl p-4 flex flex-col items-center justify-center gap-3 group cursor-pointer shadow-sm border ${gravando
                        ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.2)] animate-pulse'
                        : 'bg-brand-600 hover:bg-brand-700 border-brand-500 text-white shadow-[0_4px_15px_rgba(255,102,0,0.2)]'
                        }`}
                >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${gravando ? 'bg-red-100 dark:bg-red-900/50' : 'bg-white/20'
                        }`}>
                        <Mic className={gravando ? 'text-red-600 dark:text-red-400' : 'text-white'} size={24} />
                    </div>
                    <span className={`text-sm font-bold ${gravando ? 'text-red-700 dark:text-red-400' : 'text-white'}`}>
                        {gravando ? 'Gravando...' : 'Ditar Nota'}
                    </span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Coluna Esquerda: Overview (2/3) */}
                <div className="md:col-span-2 space-y-8">

                    {/* Insights de Venda (Oportunidades) */}
                    {oportunidades.length > 0 && (
                        <section className="bg-brand-50/50 dark:bg-brand-900/10 border border-brand-200 dark:border-brand-800/50 rounded-3xl p-6 md:p-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-brand-500/5 rounded-full blur-3xl -mr-20 -mt-20" />
                            <div className="flex items-center gap-3 mb-6 relative z-10">
                                <div className="p-2 bg-brand-100 dark:bg-brand-900/40 rounded-lg text-brand-600 dark:text-brand-400">
                                    <TrendingUp size={24} />
                                </div>
                                <h2 className="font-bold text-xl md:text-2xl tracking-tight text-slate-900 dark:text-slate-50 font-display">Oportunidades Identificadas</h2>
                            </div>
                            <div className="space-y-4 relative z-10">
                                {oportunidades.map((op: any, i: number) => op && (
                                    <div key={i} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:border-brand-300 dark:hover:border-brand-700 transition-colors">
                                        <div>
                                            <p className="font-bold text-slate-900 dark:text-slate-100 text-base mb-1 font-display">{op.nome}</p>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Baseado no faturamento de <strong className="text-slate-700 dark:text-slate-300">{cliente.faturamentoMensalAprox}</strong></p>
                                        </div>
                                        <button
                                            onClick={() => router.push(`/catalogo/${op.id}`)}
                                            className="text-xs font-bold uppercase tracking-wider bg-brand-600 hover:bg-brand-700 text-white px-4 py-2.5 rounded-xl cursor-pointer transition-colors whitespace-nowrap text-center"
                                        >
                                            Ver Argumentos
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Timeline de Reuniões/Anotações */}
                    <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 font-display">Histórico de Conta</h2>
                            <button className="text-sm font-bold text-brand-600 dark:text-brand-400 flex items-center gap-1.5 hover:text-brand-700 dark:hover:text-brand-300 transition-colors cursor-pointer bg-brand-50 dark:bg-brand-900/20 px-3 py-1.5 rounded-lg">
                                <Plus size={16} /> Nova Nota
                            </button>
                        </div>
                        <div className="relative pl-6 sm:pl-8 space-y-8">
                            {/* Decorative Line */}
                            <div className="absolute left-2.5 sm:left-3.5 top-2 bottom-2 w-px bg-slate-200 dark:bg-slate-800" />

                            {cliente.anotacoes.map((nota: any, i: number) => (
                                <div key={i} className="relative">
                                    <div className={`absolute -left-6 sm:-left-8 top-1 w-5 h-5 rounded-full border-4 border-white dark:border-slate-900 flex items-center justify-center shadow-sm z-10 ${nota.tipo === 'Reunião' ? 'bg-blue-500' :
                                        nota.tipo === 'Alerta' ? 'bg-red-500' : 'bg-slate-400'
                                        }`}>
                                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                                            {new Date(nota.data).toLocaleDateString('pt-BR')}
                                        </p>
                                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded sm:ml-2 ${nota.tipo === 'Reunião' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
                                            nota.tipo === 'Alerta' ? 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
                                                'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                            }`}>
                                            {nota.tipo}
                                        </span>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 shadow-sm text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                                        {nota.texto}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Coluna Direita: Dados Básicos (1/3) */}
                <div className="space-y-6">
                    {/* Contatos */}
                    <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                        <h2 className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-50 mb-5 flex items-center gap-2 font-display">
                            <Users size={18} className="text-slate-400" /> Contatos Principais
                        </h2>
                        <div className="space-y-5">
                            {cliente.contatos.map((contato: any, i: number) => (
                                <div key={i} className={`pb-5 ${i !== cliente.contatos.length - 1 ? 'border-b border-slate-100 dark:border-slate-800/80' : 'pb-0'}`}>
                                    <p className="font-bold text-base text-slate-900 dark:text-slate-100 mb-0.5">{contato.nome}</p>
                                    <p className="text-xs text-brand-600 dark:text-brand-400 font-semibold mb-3 uppercase tracking-wider">{contato.cargo}</p>
                                    <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400 mb-2 font-medium">
                                        <div className="w-6 h-6 rounded-md bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                            <Phone size={14} />
                                        </div>
                                        {contato.telefone}
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400 font-medium overflow-hidden">
                                        <div className="w-6 h-6 rounded-md bg-slate-50 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 text-slate-400">
                                            <Mail size={14} />
                                        </div>
                                        <span className="truncate">{contato.email}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Produtos Contratados */}
                    <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                        <h2 className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-50 mb-5 flex items-center gap-2 font-display">
                            <Briefcase size={18} className="text-slate-400" /> Produtos Ativos
                        </h2>
                        {produtosContratados.length === 0 ? (
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-center">Nenhum produto contratado ainda.</p>
                        ) : (
                            <ul className="space-y-3">
                                {produtosContratados.map((p: any) => p && (
                                    <li key={p.id} className="flex items-start gap-3 text-sm bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
                                        <div className="mt-0.5 bg-emerald-100 dark:bg-emerald-900/30 p-0.5 rounded-full text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                                            <CheckCircle2 size={14} />
                                        </div>
                                        <span className="font-semibold text-slate-700 dark:text-slate-300 leading-snug">{p.nome}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>
                </div>

            </div>
        </div>
    );
}
