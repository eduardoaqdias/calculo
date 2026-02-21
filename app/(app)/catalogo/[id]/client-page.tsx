// Componente de UI para o Detalhe do Produto
'use client';

import { notFound } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, ShieldAlert, Cpu, Share2 } from 'lucide-react';
import Link from 'next/link';

export default function ProdutoDetalheClient({ produto }: { produto: any }) {
    if (!produto) return notFound();

    return (
        <div className="max-w-3xl mx-auto pb-24 md:pb-16 mt-4 md:mt-8">
            {/* Header / Botão Voltar */}
            <div className="sticky top-0 z-30 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl -mx-4 px-4 py-4 border-b border-slate-200 dark:border-slate-800 md:static md:bg-transparent md:border-none md:p-0 md:mb-8 md:mx-0 flex items-center justify-between">
                <Link
                    href="/catalogo"
                    className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors group cursor-pointer"
                >
                    <ArrowLeft size={18} className="transform group-hover:-translate-x-1 transition-transform" />
                    Voltar ao Catálogo
                </Link>
                <button className="flex items-center gap-2 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase tracking-wider bg-brand-50 dark:bg-brand-900/40 border border-brand-200 dark:border-brand-800/50 px-3 py-1.5 rounded-lg active:scale-95 transition-all hover:bg-brand-100 dark:hover:bg-brand-900/60 cursor-pointer shadow-sm">
                    <Share2 size={14} />
                    Compartilhar
                </button>
            </div>

            {/* Imagem Hero */}
            <div className="relative -mx-4 h-64 md:h-[400px] md:mx-0 md:rounded-[2.5rem] overflow-hidden mb-10 md:mb-12 shadow-sm border border-slate-200/50 dark:border-slate-800/50 group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={produto.imagemUrl}
                    alt={produto.nome}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent opacity-90" />
                <div className="absolute inset-0 bg-brand-900/10 mix-blend-overlay" />
                <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 md:right-10 flex flex-col items-start">
                    <span className="inline-block px-4 py-1.5 bg-brand-500 text-white text-[11px] font-black uppercase tracking-widest rounded-lg mb-4 shadow-sm border border-brand-400/50">
                        {produto.categoria}
                    </span>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-2 font-display leading-[1.1]">
                        {produto.nome}
                    </h1>
                </div>
            </div>

            {/* Conteúdo Principal */}
            <div className="space-y-10 md:space-y-14">
                {/* O que é */}
                <section>
                    <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed text-lg md:text-xl max-w-2xl">
                        {produto.descricaoCompleta}
                    </p>
                </section>

                {/* Perfil Ideal de Cliente (ICP) */}
                <section className="bg-brand-50/50 dark:bg-brand-900/10 border border-brand-200 dark:border-brand-800/50 rounded-3xl p-6 md:p-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700" />
                    <div className="flex items-center gap-3 mb-4 text-brand-600 dark:text-brand-400 relative z-10">
                        <div className="p-2 bg-brand-100 dark:bg-brand-900/30 rounded-lg">
                            <ShieldAlert size={20} />
                        </div>
                        <h2 className="font-bold text-sm tracking-widest uppercase">Perfil de Cliente Ideal (ICP)</h2>
                    </div>
                    <p className="text-base font-medium text-slate-700 dark:text-slate-300 relative z-10">
                        {produto.indicacao}
                    </p>
                </section>

                {/* Argumentos de Venda (Vantagens) */}
                <section>
                    <h2 className="text-2xl font-bold mb-6 tracking-tight text-slate-900 dark:text-slate-50 flex items-center gap-3 font-display">
                        Argumentos Matadores
                        <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/30 border border-brand-200 dark:border-brand-800/50 px-2 py-1 rounded-md uppercase tracking-wider translate-y-px">Fale para o cliente</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {produto.vantagens.map((vantagem: any, index: number) => (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.4 }}
                                key={index}
                                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:border-brand-300 dark:hover:border-brand-700 transition-colors group"
                            >
                                <div className="w-10 h-10 rounded-full bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-sm mb-4 border border-brand-100 dark:border-brand-800/50 group-hover:scale-110 transition-transform">
                                    {index + 1}
                                </div>
                                <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 mb-2 leading-tight">{vantagem.titulo}</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{vantagem.descricao}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Diferenciais Competitivos */}
                <section>
                    <h2 className="text-2xl font-bold mb-6 tracking-tight text-slate-900 dark:text-slate-50 font-display">Diferenciais Protege</h2>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-6 md:p-8 rounded-3xl">
                        {produto.diferenciais.map((dif: string, index: number) => (
                            <li key={index} className="flex items-start gap-3 text-sm font-medium">
                                <div className="mt-0.5 bg-emerald-100 dark:bg-emerald-900/30 p-1 rounded-full text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                                    <CheckCircle2 size={16} />
                                </div>
                                <span className="text-slate-700 dark:text-slate-300 leading-snug">{dif}</span>
                            </li>
                        ))}
                    </ul>
                </section>

                {/* Especificações Técnicas */}
                {produto.especificacoesTercnicas && (
                    <section className="pt-8 md:pt-10 border-t border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400">
                                <Cpu size={20} />
                            </div>
                            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 font-display">Especificações Oficiais</h2>
                        </div>
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
                            <dl className="divide-y divide-slate-100 dark:divide-slate-800/60">
                                {Object.entries(produto.especificacoesTercnicas).map(([chave, valor]: [string, any]) => (
                                    <div key={chave} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 sm:px-6 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors gap-2 sm:gap-4">
                                        <dt className="text-sm font-bold text-slate-500 dark:text-slate-400 capitalize">{chave}</dt>
                                        <dd className="text-sm font-semibold text-slate-900 dark:text-slate-100 sm:text-right">{valor}</dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    </section>
                )}
            </div>

            <div className="h-10" />
        </div>
    );
}
