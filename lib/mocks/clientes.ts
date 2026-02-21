export type StatusCliente = 'Ativo' | 'Em Risco' | 'Prospect' | 'Inativo';

export interface Contato {
    nome: string;
    cargo: string;
    telefone: string;
    email: string;
}

export interface Cliente {
    id: string;
    nomeFantasia: string;
    razaoSocial: string;
    cnpj: string;
    status: StatusCliente;
    endereco: string;
    segmento: string;
    faturamentoMensalAprox: string; // Ex: "R$ 500k - 1M"
    contatos: Contato[];
    produtosContratados: string[]; // IDs dos produtos
    oportunidadesCrossSell: string[]; // IDs dos produtos indicados p/ upsell
    anotacoes: { data: string; texto: string; tipo: 'Reunião' | 'Ligação' | 'Alerta' }[];
    ultimaVisita?: string;
}

export const CLIENTES_MOCK: Cliente[] = [
    {
        id: 'cli-001',
        nomeFantasia: 'Supermercado Nova Era',
        razaoSocial: 'Nova Era Varegista LTDA',
        cnpj: '12.345.678/0001-90',
        status: 'Ativo',
        segmento: 'Varejo / Supermercado',
        endereco: 'Av. Paulista, 1000 - São Paulo, SP',
        faturamentoMensalAprox: 'Acima de R$ 5M',
        contatos: [
            { nome: 'Carlos Silva', cargo: 'Gerente Geral', telefone: '(11) 99999-1111', email: 'carlos@novaera.com' },
            { nome: 'Ana Costa', cargo: 'Tesouraria', telefone: '(11) 98888-2222', email: 'vendas@novaera.com' }
        ],
        produtosContratados: ['transporte-valores-avancado'],
        oportunidadesCrossSell: ['cofre-smart-safe'],
        ultimaVisita: '2026-02-15T14:30:00Z',
        anotacoes: [
            { data: '2026-02-15T14:30:00Z', texto: 'Apresentei o Smart Safe. Carlos achou caro, mas a Ana adorou a redução de tempo no fechamento.', tipo: 'Reunião' },
            { data: '2026-01-10T09:00:00Z', texto: 'Renovação de contrato de blindado concluída com sucesso.', tipo: 'Ligação' }
        ]
    },
    {
        id: 'cli-002',
        nomeFantasia: 'Farmácias Saúde+',
        razaoSocial: 'Farmacia e Bem Estar Saúde Mais S/A',
        cnpj: '98.765.432/0001-10',
        status: 'Prospect',
        segmento: 'Farma',
        endereco: 'Rua das Flores, 450 - Campinas, SP',
        faturamentoMensalAprox: 'R$ 1M - R$ 5M',
        contatos: [
            { nome: 'Roberto Almeida', cargo: 'Diretor de Expansão', telefone: '(19) 97777-3333', email: 'roberto@saudemais.com.br' }
        ],
        produtosContratados: [],
        oportunidadesCrossSell: ['cofre-mini-safe', 'transporte-valores-avancado'],
        anotacoes: [
            { data: '2026-02-18T10:00:00Z', texto: 'Estão usando a concorrência (Brink\'s). Reclamaram de atrasos na coleta. Boa brecha para entrarmos.', tipo: 'Alerta' }
        ]
    },
    {
        id: 'cli-003',
        nomeFantasia: 'Posto Graal',
        razaoSocial: 'Auto Posto Estradeiro LTDA',
        cnpj: '11.222.333/0001-44',
        status: 'Em Risco',
        segmento: 'Posto de Combustível',
        endereco: 'Rod. Anhanguera, Km 50 - Jundiaí, SP',
        faturamentoMensalAprox: 'R$ 500k - R$ 1M',
        contatos: [
            { nome: 'Marcos Souza', cargo: 'Proprietário', telefone: '(11) 96666-4444', email: 'marcos@postoestradeiro.com' }
        ],
        produtosContratados: ['cofre-smart-safe'],
        oportunidadesCrossSell: ['atendimento-atm'],
        ultimaVisita: '2026-02-01T15:00:00Z',
        anotacoes: [
            { data: '2026-02-01T15:00:00Z', texto: 'Cliente reclamou que o cofre travou no último fim de semana. Solicitei manutenção de emergência.', tipo: 'Reunião' },
            { data: '2026-02-02T10:00:00Z', texto: 'Problema do cofre resolvido. Retomar confiança.', tipo: 'Alerta' }
        ]
    }
];
