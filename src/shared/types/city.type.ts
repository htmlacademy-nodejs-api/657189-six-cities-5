export enum CityNames {
  Paris = 'paris',
  Cologne = 'cologne',
  Brussels = 'brussels',
  Amsterdam = 'amsterdam',
  Hamburg = 'hamburg',
  Dusseldorf = 'dusseldorf',
}

export type City = {
  name: CityNames;
  lat: number;
  lon: number;
};
