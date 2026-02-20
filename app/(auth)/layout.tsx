import type { Metadata } from 'next';
import '../../styles/globals.css';

export const metadata: Metadata = {
    title: 'Acesso Corporativo — Protege',
    description: 'Plataforma Corporativa Protege — Autenticação segura',
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            {children}
        </div>
    );
}
