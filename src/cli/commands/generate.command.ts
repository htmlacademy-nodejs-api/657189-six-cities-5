import axios from 'axios';

import { Command } from './command.interface.js';
import { TSVFileWriter } from '../../shared/libs/file-writer/tsv-file-writer.js';
import { TSVRentOfferGenerator } from '../../shared/libs/offerGenerator/tsv-rent-offer-generator.js';
import { MockServerData } from '../../shared/types/mock-server-data.type.js';
import { ConsoleLogger, Logger } from '../../shared/libs/logger/index.js';

const RADIX = 10;

export class GenerateCommand implements Command {
  private initialData: MockServerData;

  private logger: Logger;

  constructor() {
    this.logger = new ConsoleLogger();
  }

  private async load(url: string) {
    try {
      this.initialData = (await axios.get(url)).data;
    } catch (error) {
      throw new Error(`Can't load data from ${url}`);
    }
  }

  private async write(filepath: string, offersCount: number) {
    const fileWriter = new TSVFileWriter(filepath);
    const offerGenerator = new TSVRentOfferGenerator(this.initialData);

    for (let i = 0; i < offersCount; i++) {
      await fileWriter.write(offerGenerator.generate());
    }
  }

  getName(): string {
    return '--generate';
  }

  async execute(...params: string[]): Promise<void> {
    const [count, filepath, url] = params;
    const offersCount = Number.parseInt(count, RADIX);

    try {
      await this.load(url);
      await this.write(filepath, offersCount);
      this.logger.info(`File ${filepath} was created!`);
    } catch (error: unknown) {
      this.logger.error('Not able to generate the data. Details:', error);
    }
  }
}
