export type CategoriaProduto = 'Transporte de Valores' | 'Cofres Inteligentes' | 'Logística de Cargas' | 'Atendimento em ATM' | 'Gestão de Numerário';

export interface Vantagem {
    titulo: string;
    descricao: string;
}

export interface Produto {
    id: string;
    nome: string;
    categoria: CategoriaProduto;
    descricaoCurta: string;
    descricaoCompleta: string;
    imagemUrl: string;
    diferenciais: string[];
    vantagens: Vantagem[];
    indicacao: string;
    especificacoesTercnicas?: Record<string, string>;
}

export const PRODUTOS_MOCK: Produto[] = [
    {
        id: 'cofre-smart-safe',
        nome: 'Smart Safe V2',
        categoria: 'Cofres Inteligentes',
        descricaoCurta: 'Cofre inteligente com depósito validado na hora e crédito em D0.',
        descricaoCompleta: 'O Smart Safe V2 transforma a tesouraria do seu cliente. O dinheiro depositado é validado por sensores infravermelhos, contabilizado no portal Protege em tempo real, e o risco passa a ser 100% da Protege a partir do momento do depósito. Ideal para o varejo de alto fluxo que sofre com furtos e ociosidade de gerentes no fechamento de caixa.',
        imagemUrl: 'https://images.unsplash.com/photo-1621252179027-94459d278660?q=80&w=600&auto=format&fit=crop', // Placeholder ilustrativo
        diferenciais: [
            'Crédito em conta no mesmo dia (D0)',
            'Identificação de notas falsas',
            'Risco transferido para a Protege no ato do depósito',
            'Monitoramento online do saldo via portal',
        ],
        vantagens: [
            { titulo: 'Redução de Custos', descricao: 'Elimina a necessidade de fechamento de caixa demorado e recontagem.' },
            { titulo: 'Segurança Máxima', descricao: 'Acesso apenas por biometria ou senha dinâmica autorizada.' },
        ],
        indicacao: 'Supermercados, postos de gasolina, farmácias de grande porte e atacadistas.',
        especificacoesTercnicas: {
            'Capacidade': 'Até 5.000 cédulas',
            'Velocidade de Leitura': '300 cédulas por minuto',
            'Conectividade': '4G/Wi-Fi/Ethernet',
            'Dimensões': '120cm (A) x 50cm (L) x 60cm (P)',
        }
    },
    {
        id: 'transporte-valores-avancado',
        nome: 'Logística de Valores (Blindado)',
        categoria: 'Transporte de Valores',
        descricaoCurta: 'Recolhimento e entrega de numerário com a maior frota e capilaridade do Brasil.',
        descricaoCompleta: 'Serviço clássico e essencial com a confiança de mais de 50 anos da Protege. Coletas programadas ou sob demanda, embarque e desembarque seguros, com escolta armada e rastreamento 24/7. Garante que a sangria do caixa chegue ao banco sem exposição dos funcionários do cliente.',
        imagemUrl: 'https://images.unsplash.com/photo-1580130635293-27150aee24fe?q=80&w=600&auto=format&fit=crop',
        diferenciais: [
            'Maior frota e alcance nacional',
            'Profissionais altamente treinados',
            'Rastreamento em tempo real da equipe',
            'Apólice de seguro robusta',
        ],
        vantagens: [
            { titulo: 'Foco no Core Business', descricao: 'O cliente foca em vender, nós focamos no dinheiro dele.' },
            { titulo: 'Riscos Mitigados', descricao: 'Tira o alvo das costas do funcionário que antes ia ao banco a pé.' },
        ],
        indicacao: 'Qualquer varejo, bancos, correspondentes bancários, lotéricas.',
    },
    {
        id: 'cofre-mini-safe',
        nome: 'Mini Safe Protege',
        categoria: 'Cofres Inteligentes',
        descricaoCurta: 'Cofre inteligente compacto para pequenos lojistas.',
        descricaoCompleta: 'Toda a tecnologia dos cofres High-End da Protege em um formato ideal para caber debaixo do balcão de pequenos e médios varejistas. Validação automática e crédito facilitado.',
        imagemUrl: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?q=80&w=600&auto=format&fit=crop',
        diferenciais: [
            'Tamanho compacto',
            'Instalação Plug n Play',
            'Dashboard via App do cliente'
        ],
        vantagens: [
            { titulo: 'Acesso Democratizado', descricao: 'Tecnologia de ponta por uma mensalidade acessível.' },
        ],
        indicacao: 'Lojas de shopping, padarias, pequenos mercados, franquias.',
        especificacoesTercnicas: {
            'Capacidade': 'Até 1.200 cédulas',
            'Dimensões': '80cm (A) x 40cm (L) x 45cm (P)',
        }
    }
];
