import { HousingOffer } from '../../types/housing-offer.type.js';

export interface FileReader {
  read(): void;
  toArray(): HousingOffer[];
}
