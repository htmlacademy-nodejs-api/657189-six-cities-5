import chalk from 'chalk';
import { TSVFileReader } from '../../shared/libs/file-reader/index.js';
import { Command } from './command.interface.js';

export class ImportCommand implements Command {
  public getName(): string {
    return '--import';
  }

  public execute(...params: string[]): void {
    const [filename] = params;
    const fileReader = new TSVFileReader(filename.trim());

    try {
      fileReader.read();
      console.log(fileReader.toArray());
    } catch (err) {
      if (!(err instanceof Error)) {
        throw err;
      }

      console.error(`
          Can't import data from file: ${chalk.green(filename)}
          Details: ${chalk.bgRed(err.message)}
      `);
    }
  }
}
