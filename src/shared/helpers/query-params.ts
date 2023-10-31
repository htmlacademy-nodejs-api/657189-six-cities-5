const DEFAULT_RADIX = 10;

export function parseQueryAsInteger(param: unknown, radix?: number): number | null {
  if (typeof param !== 'string') {
    return null;
  }

  const parsedParam = Number.parseInt(param, radix ?? DEFAULT_RADIX);

  return Number.isInteger(parsedParam) ? parsedParam : null;
}

export function parseQueryAsString(param: unknown): string | null {
  return typeof param === 'string' ? param : null;
}
