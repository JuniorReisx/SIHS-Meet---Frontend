// src/services/meetingService.ts

import { useState } from "react";
import type { Meeting } from "../types/types";

const API_BASE_URL = "http://localhost:3000/api";

// Detecta automaticamente o ambiente
const API_URL = API_BASE_URL;

// Interface para criar/atualizar reunião (formato da API)
interface MeetingPayload {
  title: string;
  meeting_date: string; // YYYY-MM-DD
  start_time: string; // HH:mm
  end_time?: string; // HH:mm (opcional)
  location: string;
  participants_count?: number;
  description?: string;
}

// Interface para a resposta da API
interface MeetingResponse {
  id: number;
  title: string;
  meeting_date: string;
  start_time: string;
  end_time?: string;
  location: string;
  participants_count?: number;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

// ==================== GERENCIAMENTO DE TOKEN ====================
// Armazena o token em memória durante a sessão
let authToken: string | null = null;

/**
 * Define o token de autenticação
 */
export const setAuthToken = (token: string | null): void => {
  authToken = token;
};

/**
 * Obtém o token de autenticação
 */
export const getAuthToken = (): string | null => {
  return authToken;
};

/**
 * Remove o token de autenticação
 */
export const clearAuthToken = (): void => {
  authToken = null;
};

// ==================== FUNÇÕES AUXILIARES ====================

// Função auxiliar para criar headers com autenticação
const getHeaders = (): HeadersInit => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  return headers;
};

// Função auxiliar para converter resposta da API para o formato interno
const convertToMeeting = (response: MeetingResponse): Meeting => {
  return {
    id: response.id,
    title: response.title,
    date: response.meeting_date,
    time: response.start_time,
    endTime: response.end_time,
    location: response.location,
    participants: `${response.participants_count || 0} participantes`,
    description: response.description || "",
  };
};

// Função auxiliar para converter Meeting para o formato da API
const convertToPayload = (meeting: Partial<Meeting>): Partial<MeetingPayload> => {
  const payload: Partial<MeetingPayload> = {};
  
  if (meeting.title) payload.title = meeting.title;
  if (meeting.date) payload.meeting_date = meeting.date;
  if (meeting.time) payload.start_time = meeting.time;
  if (meeting.endTime) payload.end_time = meeting.endTime;
  if (meeting.location) payload.location = meeting.location;
  if (meeting.description) payload.description = meeting.description;
  
  // Converter participants (string) para participants_count (number)
  if (meeting.participants) {
    // Extrai apenas os números da string (ex: "10 participantes" -> 10)
    const count = parseInt(meeting.participants.replace(/\D/g, '')) || 0;
    payload.participants_count = count;
  }
  
  return payload;
};

// ==================== SERVIÇOS DE REUNIÕES ====================

/**
 * Criar uma nova reunião
 */
export const createMeeting = async (meeting: Omit<Meeting, "id">): Promise<Meeting> => {
  const payload = convertToPayload(meeting);
  
  // Validação dos campos obrigatórios
  if (!payload.title || !payload.meeting_date || !payload.start_time || !payload.end_time || !payload.location) {
    throw new Error("Campos obrigatórios: title, meeting_date, start_time, end_time, location, participants_count");
  }
  
  const response = await fetch(`${API_URL}/meetings`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Erro ao criar reunião");
  }

  const data: MeetingResponse = await response.json();
  return convertToMeeting(data);
};

/**
 * Listar todas as reuniões
 */
export const getAllMeetings = async (): Promise<Meeting[]> => {
  const response = await fetch(`${API_URL}/meetingsConfirmed/all`, {
    method: "GET",
    headers: getHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Erro ao buscar reuniões");
  }

  const data = await response.json();
  
  // Verifica se a resposta é um array ou objeto com propriedade de array
  const meetingsArray = Array.isArray(data) ? data : (data.meetings || data.data || []);
  
  return meetingsArray.map(convertToMeeting);
};

/**
 * Buscar reunião por ID
 */
export const getMeetingById = async (id: number): Promise<Meeting> => {
  const response = await fetch(`${API_URL}/meetings/${id}`, {
    method: "GET",
    headers: getHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Erro ao buscar reunião");
  }

  const data: MeetingResponse = await response.json();
  return convertToMeeting(data);
};

/**
 * Atualizar uma reunião
 */
export const updateMeeting = async (
  id: number,
  meeting: Partial<Meeting>
): Promise<Meeting> => {
  const payload = convertToPayload(meeting);
  
  const response = await fetch(`${API_URL}/meetings/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Erro ao atualizar reunião");
  }

  const data: MeetingResponse = await response.json();
  return convertToMeeting(data);
};

/**
 * Deletar uma reunião
 */
export const deleteMeeting = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/meetings/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Erro ao deletar reunião");
  }
};

/**
 * Buscar reuniões futuras
 */
export const getUpcomingMeetings = async (): Promise<Meeting[]> => {
  const response = await fetch(`${API_URL}/meetings/upcoming`, {
    method: "GET",
    headers: getHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Erro ao buscar reuniões futuras");
  }

  const data = await response.json();
  const meetingsArray = Array.isArray(data) ? data : (data.meetings || data.data || []);
  
  return meetingsArray.map(convertToMeeting);
};

/**
 * Buscar reuniões passadas
 */
export const getPastMeetings = async (): Promise<Meeting[]> => {
  const response = await fetch(`${API_URL}/meetings/past`, {
    method: "GET",
    headers: getHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Erro ao buscar reuniões passadas");
  }

  const data = await response.json();
  const meetingsArray = Array.isArray(data) ? data : (data.meetings || data.data || []);
  
  return meetingsArray.map(convertToMeeting);
};

/**
 * Buscar reuniões por data
 */
export const getMeetingsByDate = async (date: string): Promise<Meeting[]> => {
  const response = await fetch(`${API_URL}/meetings/date/${date}`, {
    method: "GET",
    headers: getHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Erro ao buscar reuniões por data");
  }

  const data = await response.json();
  const meetingsArray = Array.isArray(data) ? data : (data.meetings || data.data || []);
  
  return meetingsArray.map(convertToMeeting);
};

/**
 * Buscar reuniões por local
 */
export const getMeetingsByLocation = async (location: string): Promise<Meeting[]> => {
  const response = await fetch(`${API_URL}/meetings/location/${encodeURIComponent(location)}`, {
    method: "GET",
    headers: getHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Erro ao buscar reuniões por local");
  }

  const data: MeetingResponse[] = await response.json();
  return data.map(convertToMeeting);
};

/**
 * Buscar reuniões por intervalo de datas
 */
export const getMeetingsByDateRange = async (
  startDate: string,
  endDate: string
): Promise<Meeting[]> => {
  const response = await fetch(
    `${API_URL}/meetings/range?startDate=${startDate}&endDate=${endDate}`,
    {
      method: "GET",
      headers: getHeaders(),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Erro ao buscar reuniões por intervalo");
  }

  const data: MeetingResponse[] = await response.json();
  return data.map(convertToMeeting);
};

// ==================== HOOK PERSONALIZADO ====================

/**
 * Hook React para gerenciar reuniões
 * Use este hook em seus componentes para facilitar o gerenciamento de estado
 */
export const useMeetings = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMeetings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllMeetings();
      setMeetings(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const addMeeting = async (meeting: Omit<Meeting, "id">) => {
    setLoading(true);
    setError(null);
    try {
      const newMeeting = await createMeeting(meeting);
      setMeetings((prev) => [...prev, newMeeting]);
      return newMeeting;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeMeeting = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await deleteMeeting(id);
      setMeetings((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const editMeeting = async (id: number, meeting: Partial<Meeting>) => {
    setLoading(true);
    setError(null);
    try {
      const updatedMeeting = await updateMeeting(id, meeting);
      setMeetings((prev) => prev.map((m) => (m.id === id ? updatedMeeting : m)));
      return updatedMeeting;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    meetings,
    loading,
    error,
    fetchMeetings,
    addMeeting,
    removeMeeting,
    editMeeting,
  };
};