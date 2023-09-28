import chalk from 'chalk';
import { TSVFileReader } from '../../shared/libs/file-reader/index.js';
import { Command } from './command.interface.js';
import { createRentOffer } from '../../shared/helpers/create-rent-offer.js';
import { getErrorMessage } from '../../shared/helpers/common.js';

export class ImportCommand implements Command {
  private handleImportLine(line: string) {
    const offer = createRentOffer(line);
    console.info(offer);
  }

  private handleCompleteImport(count: number) {
    console.info(`${count} rows imported`);
  }

  public getName(): string {
    return '--import';
  }

  public async execute(...params: string[]): Promise<void> {
    const [filename] = params;
    const fileReader = new TSVFileReader(filename.trim());

    fileReader.on('completeRow', this.handleImportLine);
    fileReader.on('readingFinished', this.handleCompleteImport);

    try {
      await fileReader.read();
    } catch (error) {
      console.error(`
          Can't import data from file: ${chalk.green(filename)}
          Details: ${chalk.bgRed(getErrorMessage(error))}
      `);
    }
  }
}
