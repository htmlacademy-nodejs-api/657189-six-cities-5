import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

export const getCurrentModuleDirectoryPath = () => {
  const filepath = fileURLToPath(import.meta.url);
  return dirname(filepath);
};
