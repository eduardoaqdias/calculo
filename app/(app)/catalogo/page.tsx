'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Shield, ChevronRight, Filter } from 'lucide-react';
import Link from 'next/link';
import { PRODUTOS_MOCK, CategoriaProduto } from '@/lib/mocks/produtos';

const categoriasUnicas = Array.from(new Set(PRODUTOS_MOCK.map(p => p.categoria)));

export default function CatalogoPage() {
    const [busca, setBusca] = useState('');
    const [categoriaAtiva, setCategoriaAtiva] = useState<CategoriaProduto | 'Todas'>('Todas');

    const produtosFiltrados = PRODUTOS_MOCK.filter(p => {
        const matchBusca = p.nome.toLowerCase().includes(busca.toLowerCase()) || p.descricaoCurta.toLowerCase().includes(busca.toLowerCase());
        const matchCategoria = categoriaAtiva === 'Todas' || p.categoria === categoriaAtiva;
        return matchBusca && matchCategoria;
    });

    return (
        <div className="max-w-4xl mx-auto pb-10">
            {/* Cabeçalho */}
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl justify-between font-black tracking-tighter flex items-center gap-3">
                    Munição de Vendas
                    <Shield className="text-brand-500 w-8 h-8" />
                </h1>
                <p className="text-muted mt-2 text-sm md:text-base">
                    Encontre rapidamente especificações, diferenciais e argumentos para fechar mais negócios.
                </p>
            </div>

            {/* Barra de Busca e Filtros */}
            <div className="sticky top-14 z-20 bg-background/95 backdrop-blur-xl py-4 -mx-4 px-4 md:mx-0 md:px-0 md:top-0 md:relative md:py-0 md:mb-8">
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-muted/60" />
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar cofres, blindado, logística..."
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                            className="block w-full pl-10 pr-4 py-3 bg-card border border-border/50 rounded-2xl text-sm shadow-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all placeholder:text-muted/50 font-medium"
                        />
                    </div>
                </div>

                {/* Categorias (Scroll Horizontal Mobile) */}
                <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-none snap-x">
                    <button
                        onClick={() => setCategoriaAtiva('Todas')}
                        className={`snap-start whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all ${categoriaAtiva === 'Todas'
                            ? 'bg-foreground text-background'
                            : 'bg-card border border-border/50 text-muted hover:bg-foreground/5'
                            }`}
                    >
                        Todas as Soluções
                    </button>
                    {categoriasUnicas.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setCategoriaAtiva(cat)}
                            className={`snap-start whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all ${categoriaAtiva === cat
                                ? 'bg-brand-500 text-white shadow-[0_0_15px_rgba(255,102,0,0.3)]'
                                : 'bg-card border border-border/50 text-muted hover:bg-foreground/5'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Listagem de Produtos */}
            <AnimatePresence mode="popLayout">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {produtosFiltrados.length === 0 ? (
                        <div className="col-span-full py-12 text-center text-muted">
                            <p>Nenhuma solução encontrada para os filtros atuais.</p>
                        </div>
                    ) : (
                        produtosFiltrados.map((produto) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                key={produto.id}
                            >
                                <Link href={`/catalogo/${produto.id}`}>
                                    <div className="group relative bg-card border border-border/50 rounded-2xl p-1 overflow-hidden transition-all hover:border-brand-500/30 hover:shadow-[0_8px_30px_rgba(255,102,0,0.08)] active:scale-[0.98]">
                                        <div className="relative h-44 rounded-xl overflow-hidden bg-muted/10 mb-2">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={produto.imagemUrl}
                                                alt={produto.nome}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                            <div className="absolute bottom-3 left-3 right-3">
                                                <span className="inline-block px-2 py-1 bg-brand-500 text-white text-[10px] font-black uppercase tracking-wider rounded-md mb-2">
                                                    {produto.categoria}
                                                </span>
                                                <h3 className="text-white font-bold leading-tight">{produto.nome}</h3>
                                            </div>
                                        </div>

                                        <div className="px-3 pb-3">
                                            <p className="text-muted text-xs line-clamp-2 min-h-[32px] mb-3">
                                                {produto.descricaoCurta}
                                            </p>

                                            <div className="flex items-center justify-between mt-auto">
                                                <span className="text-[10px] font-bold text-muted/60 uppercase tracking-widest">Ver Argumentos</span>
                                                <div className="w-6 h-6 rounded-full bg-brand-500/10 flex items-center justify-center text-brand-500 transition-colors group-hover:bg-brand-500 group-hover:text-white">
                                                    <ChevronRight size={14} />
                                                </div>
                                            </div>
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
