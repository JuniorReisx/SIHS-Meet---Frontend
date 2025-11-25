import type { Meeting } from "../types/types";
import type { Credentials } from "../types/types";

export const database: Meeting[] = [
    {
        id: 1,
        title: "Planejamento de Obras - Estação de Tratamento",
        date: "2025-11-25",
        time: "09:00",
        location: "Sala de Reuniões - SIHS",
        participants: "Equipe de Engenharia, Diretoria",
        description: "Discussão sobre cronograma e orçamento da nova estação",
    },
    {
        id: 2,
        title: "Revisão de Contratos - Fornecedores",
        date: "2025-11-28",
        time: "14:00",
        location: "Auditório Administrativo",
        participants: "Setor Jurídico, Compras",
        description: "Análise das renovações e novos contratos de fornecedores",
    },
    {
        id: 3,
        title: "Reunião de Alinhamento - Projetos Internos",
        date: "2025-12-02",
        time: "10:30",
        location: "Sala 03 - SIHS",
        participants: "Gestores de Setor",
        description: "Planejamento trimestral das atividades internas",
    },
    {
        id: 4,
        title: "Apresentação de Resultados - TI",
        date: "2025-12-05",
        time: "16:00",
        location: "Sala de Conferências",
        participants: "Equipe de TI, Diretoria",
        description: "Demonstração dos indicadores e melhorias do setor de TI",
    },
    {
        id: 5,
        title: "Reunião Extraordinária - Manutenção",
        date: "2025-12-10",
        time: "08:00",
        location: "Oficina de Manutenção",
        participants: "Equipe de Manutenção",
        description: "Discussão urgente sobre falha em equipamento crítico",
    }
];

export const databaseCredentials: Credentials[] = [
    {
        user: "admin",
        password: "admin123"
    },
    {
        user: "emanuel",
        departments: "SIHS",
        password: "user123",
    }
];

