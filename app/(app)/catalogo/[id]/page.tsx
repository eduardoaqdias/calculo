import { notFound } from 'next/navigation';
import { PRODUTOS_MOCK } from '@/lib/mocks/produtos';
import ProdutoDetalheClient from './client-page';

export function generateStaticParams() {
    return PRODUTOS_MOCK.map((produto) => ({
        id: produto.id,
    }));
}

export default function ProdutoDetalhePage({ params }: { params: { id: string } }) {
    const produto = PRODUTOS_MOCK.find(p => p.id === params.id);

    if (!produto) return notFound();

    return <ProdutoDetalheClient produto={produto} />;
}
