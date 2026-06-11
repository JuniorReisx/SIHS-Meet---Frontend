export type RoomConfig = {
  capacity: number;
  hasService: boolean;
  hasCoffee: boolean;
};

export const ROOM_CONFIG: Record<string, RoomConfig> = {
  "Sala de Reunião 1": { capacity: 20, hasService: true,  hasCoffee: true  },
  "Sala de Reunião 2": { capacity: 10, hasService: false, hasCoffee: true  },
  "Sala de Reunião 3": { capacity: 10, hasService: false, hasCoffee: true  },
};

export const ROOM_NAMES = Object.keys(ROOM_CONFIG);
