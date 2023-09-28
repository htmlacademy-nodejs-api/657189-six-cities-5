import { City, CityNames } from '../types/index.js';

export const CITIES: Record<CityNames, City> = {
  paris: {
    name: CityNames.Paris,
    lat: 48.85661,
    lon: 2.351499,
  },
  cologne: {
    name: CityNames.Cologne,
    lat: 50.938361,
    lon: 6.959974,
  },
  brussels: {
    name: CityNames.Brussels,
    lat: 50.846557,
    lon: 4.351697,
  },
  amsterdam: {
    name: CityNames.Amsterdam,
    lat: 52.370216,
    lon: 4.895168,
  },
  hamburg: {
    name: CityNames.Hamburg,
    lat: 53.550341,
    lon: 10.000654,
  },
  dusseldorf: {
    name: CityNames.Dusseldorf,
    lat: 51.225402,
    lon: 6.776314,
  },
} as const;
