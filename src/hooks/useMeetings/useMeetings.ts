import { useState, useEffect, useCallback } from "react";
import { API_URL } from "../../config/api";
import type { Meeting, Statistics, FilterType } from "../../types/types";

export function useMeetings() {
  const [confirmedMeetings, setConfirmedMeetings] = useState<Meeting[]>([]);
  const [pendingMeetings, setPendingMeetings] = useState<Meeting[]>([]);
  const [deniedMeetings, setDeniedMeetings] = useState<Meeting[]>([]);
  const [totalMeetings, setTotalMeetings] = useState<Meeting[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);

  // Carregar estatísticas - Memoizada com useCallback
  const loadStatistics = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/meetingsTotal/statistics`);
      if (response.ok) {
        const data = await response.json();
        setStatistics(data);
      }
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
    }
  }, []);

  // Carregar reuniões confirmadas - Memoizada com useCallback
  const loadConfirmedMeetings = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/meetingsConfirmed/all`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      let meetings: Meeting[] = [];
      if (Array.isArray(data)) {
        meetings = data;
      } else if (data && Array.isArray(data.meetings)) {
        meetings = data.meetings;
      } else if (data && Array.isArray(data.data)) {
        meetings = data.data;
      }
      
      const meetingsWithStatus: Meeting[] = meetings.map((m: Meeting) => ({ 
        ...m, 
        status: 'confirmed' as const 
      }));
      setConfirmedMeetings(meetingsWithStatus);
      return meetingsWithStatus;
    } catch (error) {
      console.error("Erro ao carregar reuniões confirmadas:", error);
      setConfirmedMeetings([]);
      return [];
    }
  }, []);

  // Carregar reuniões pendentes - Memoizada com useCallback
  const loadPendingMeetings = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/meetingsPending/all`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      let meetings: Meeting[] = [];
      if (Array.isArray(data)) {
        meetings = data;
      } else if (data && Array.isArray(data.meetings)) {
        meetings = data.meetings;
      } else if (data && Array.isArray(data.data)) {
        meetings = data.data;
      }
      
      const meetingsWithStatus: Meeting[] = meetings.map((m: Meeting) => ({ 
        ...m, 
        status: 'pending' as const 
      }));
      setPendingMeetings(meetingsWithStatus);
      return meetingsWithStatus;
    } catch (error) {
      console.error("Erro ao carregar reuniões pendentes:", error);
      setPendingMeetings([]);
      return [];
    }
  }, []);

  // Carregar reuniões negadas - Memoizada com useCallback
  const loadDeniedMeetings = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/meetingsDenied/all`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      let meetings: Meeting[] = [];
      if (Array.isArray(data)) {
        meetings = data;
      } else if (data && Array.isArray(data.meetings)) {
        meetings = data.meetings;
      } else if (data && Array.isArray(data.data)) {
        meetings = data.data;
      }
      
      const meetingsWithStatus: Meeting[] = meetings.map((m: Meeting) => ({ 
        ...m, 
        status: 'denied' as const 
      }));
      setDeniedMeetings(meetingsWithStatus);
      return meetingsWithStatus;
    } catch (error) {
      console.error("Erro ao carregar reuniões negadas:", error);
      setDeniedMeetings([]);
      return [];
    }
  }, []);

  // Carregar reuniões com filtro - Memoizada com useCallback
  const loadTotalMeetingsWithFilter = useCallback(async (
    filter: FilterType,
    customStartDate?: string,
    customEndDate?: string,
    selectedMonth?: string,
    selectedStatus?: string
  ) => {
    try {
      let url = `${API_URL}/meetingsTotal/all`;
      
      switch (filter) {
        case "last-10-days":
          url = `${API_URL}/meetingsTotal/filter/last-10-days`;
          break;
        case "last-20-days":
          url = `${API_URL}/meetingsTotal/filter/last-20-days`;
          break;
        case "last-month":
          url = `${API_URL}/meetingsTotal/filter/last-month`;
          break;
        case "last-year":
          url = `${API_URL}/meetingsTotal/filter/last-year`;
          break;
        case "upcoming":
          url = `${API_URL}/meetingsTotal/filter/upcoming`;
          break;
        case "past":
          url = `${API_URL}/meetingsTotal/filter/past`;
          break;
        case "custom":
          if (customStartDate && customEndDate) {
            url = `${API_URL}/meetingsTotal/range/dates?start=${customStartDate}&end=${customEndDate}`;
          }
          break;
        case "month":
          if (selectedMonth) {
            url = `${API_URL}/meetingsTotal/month/${selectedMonth}`;
          }
          break;
      }

      // Aplicar filtro de status se selecionado
      if (selectedStatus && selectedStatus !== "all" && filter !== "custom" && filter !== "month") {
        url = `${API_URL}/meetingsTotal/status/${selectedStatus}`;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      let meetings: Meeting[] = [];
      
      if (Array.isArray(data)) {
        meetings = data;
      } else if (data && Array.isArray(data.meetings)) {
        meetings = data.meetings;
      } else if (data && Array.isArray(data.data)) {
        meetings = data.data;
      }

      setTotalMeetings(meetings);
    } catch (error) {
      console.error("Erro ao carregar reuniões com filtro:", error);
      setTotalMeetings([]);
    }
  }, []); // Sem dependências pois recebe tudo por parâmetro

  // Carregar todas as reuniões - Memoizada com useCallback
  const loadAllMeetings = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadConfirmedMeetings(),
        loadPendingMeetings(),
        loadDeniedMeetings(),
        loadTotalMeetingsWithFilter("all"),
        loadStatistics(),
      ]);
    } catch (error) {
      console.error("Erro ao carregar reuniões:", error);
    } finally {
      setLoading(false);
    }
  }, [
    loadConfirmedMeetings,
    loadPendingMeetings,
    loadDeniedMeetings,
    loadTotalMeetingsWithFilter,
    loadStatistics
  ]);

  // useEffect corrigido com dependência
  useEffect(() => {
    loadAllMeetings();
  }, [loadAllMeetings]);

  return {
    confirmedMeetings,
    pendingMeetings,
    deniedMeetings,
    totalMeetings,
    statistics,
    loading,
    setConfirmedMeetings,
    setPendingMeetings,
    setDeniedMeetings,
    setTotalMeetings,
    loadAllMeetings,
    loadTotalMeetingsWithFilter,
  };
}