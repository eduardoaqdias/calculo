import { notFound } from 'next/navigation';
import { CLIENTES_MOCK } from '@/lib/mocks/clientes';
import ClienteDetalheClient from './client-page';

export function generateStaticParams() {
    return CLIENTES_MOCK.map((cliente) => ({
        id: cliente.id,
    }));
}

export default function ClienteDetalhePage({ params }: { params: { id: string } }) {
    const cliente = CLIENTES_MOCK.find(c => c.id === params.id);

    if (!cliente) return notFound();

    return <ClienteDetalheClient cliente={cliente} />;
}
