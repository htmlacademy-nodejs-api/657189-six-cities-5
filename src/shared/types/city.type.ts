export enum CityNames {
  Paris = 'paris',
  Cologne = 'cologne',
  Brussels = 'brussels',
  Amsterdam = 'amsterdam',
  Hamburg = 'hamburg',
  Dusseldorf = 'dusseldorf',
}

export type City = {
  name: string;
  lat: number;
  lon: number;
};
