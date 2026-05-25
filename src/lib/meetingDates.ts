/** Reunião mínima para checagem de data/horário */
export interface MeetingDateFields {
  meeting_date: string;
  start_time: string;
  end_time?: string;
}

/** Fim da reunião em Date local (usa end_time ou start_time) */
export function getMeetingEndDate(meeting: MeetingDateFields): Date {
  const [y, m, d] = meeting.meeting_date.split("-").map(Number);
  const time = meeting.end_time || meeting.start_time;
  const [h, min] = time.split(":").map(Number);
  return new Date(y, m - 1, d, h, min ?? 0, 0, 0);
}

/** true se a reunião já terminou */
export function isPastMeeting(meeting: MeetingDateFields): boolean {
  return getMeetingEndDate(meeting).getTime() < Date.now();
}

export function filterActiveMeetings<T extends MeetingDateFields>(meetings: T[]): T[] {
  return meetings.filter((m) => !isPastMeeting(m));
}

export function filterPastMeetings<T extends MeetingDateFields>(meetings: T[]): T[] {
  return meetings.filter((m) => isPastMeeting(m));
}

/** Mais recentes primeiro (útil no histórico) */
export function sortMeetingsByDateDesc<T extends MeetingDateFields>(meetings: T[]): T[] {
  return [...meetings].sort(
    (a, b) => getMeetingEndDate(b).getTime() - getMeetingEndDate(a).getTime(),
  );
}
