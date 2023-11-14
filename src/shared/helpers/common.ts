import { ClassConstructor, plainToInstance } from 'class-transformer';

export const generateRandomValue = (min: number, max: number, numAfterDigit = 0): number =>
  Number((Math.random() * (max - min) + min).toFixed(numAfterDigit));

export const getRandomItems = <T>(items: T[]): T[] => {
  const startPosition = generateRandomValue(0, items.length - 1);
  const endPosition = startPosition + generateRandomValue(startPosition, items.length);
  return items.slice(startPosition, endPosition);
};

export const getRandomItem = <T>(items: T[]): T => items[generateRandomValue(0, items.length - 1)];

export const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : '';

export function fillDTO<T, V>(someDTO: ClassConstructor<T>, plainObject: V) {
  return plainToInstance(someDTO, plainObject, { excludeExtraneousValues: true });
}

export function fillRDO<T, V>(someRDO: ClassConstructor<T>, plainObject: V) {
  return plainToInstance(someRDO, plainObject, { excludeExtraneousValues: true });
}

export function createErrorObject(message: string) {
  return {
    error: message,
  };
}

export function getFullServerPath(host: string, port: number) {
  return `http://${host}:${port}`;
}
