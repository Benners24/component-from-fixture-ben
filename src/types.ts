export interface Elements {
  wood?: number;
  fire?: number;
  earth?: number;
  metal?: number;
  water?: number;
}

export interface Reading {
  cellKey: number;
  date?: string;
  todayLabel?: string;
  animalOfDay?: string;
  relation?: string;
  headline?: string;
  favourableDirection?: string;
  clash?: boolean;
  body?: string;
  elements?: Elements;
}

export interface ReadingsFixture {
  _comment?: string;
  readings: Reading[];
}
