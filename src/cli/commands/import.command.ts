import chalk from 'chalk';

import { Command } from './command.interface.js';
import { createRentOffer } from '../../shared/helpers/create-rent-offer.js';
import { getMongoURI } from '../../shared/helpers/database.js';
import { MongoDatabaseClient, DatabaseClient } from '../../shared/libs/database-client/index.js';
import { TSVFileReader } from '../../shared/libs/file-reader/tsv-file-reader.js';
import {
  RentOfferModel,
  RentOfferService,
  DefaultRentOfferService,
} from '../../modules/rent-offer/index.js';
import { UserService, UserModel, DefaultUserService } from '../../modules/user/index.js';
import { RentOffer, User } from '../../shared/types/index.js';
import { Logger, ConsoleLogger } from '../../shared/libs/logger/index.js';

const DEFAULT_USER_PASSWORD = '123456';
const DEFAULT_DB_PORT = '27040';

export class ImportCommand implements Command {
  private userService: UserService;
  private rentOfferService: RentOfferService;
  private databaseClient: DatabaseClient;
  private logger: Logger;
  private salt: string;

  constructor() {
    this.handleImportLine = this.handleImportLine.bind(this);
    this.handleCompleteImport = this.handleCompleteImport.bind(this);

    this.logger = new ConsoleLogger();
    this.rentOfferService = new DefaultRentOfferService(this.logger, RentOfferModel);
    this.userService = new DefaultUserService(this.logger, UserModel);
    this.databaseClient = new MongoDatabaseClient(this.logger);
  }

  private async handleImportLine(line: string, resolve: () => void) {
    const offer = createRentOffer(line);

    await this.saveOffer(offer);

    resolve();
  }

  private handleCompleteImport(count: number) {
    console.info(`${count} rows imported`);
    this.databaseClient.disconnect();
  }

  public getName(): string {
    return '--import';
  }

  private async saveOffer(offer: RentOffer) {
    const user = await this.userService.findOrCreate(
      {
        ...(offer.author as Required<User>),
        password: DEFAULT_USER_PASSWORD,
      },
      this.salt,
    );

    await this.rentOfferService.create({
      title: offer.title,
      description: offer.description,
      offerDate: offer.offerDate,
      city: offer.city,
      previewImage: offer.previewImage,
      images: offer.images,
      isPremium: offer.isPremium,
      type: offer.type,
      bedrooms: offer.bedrooms,
      maxAdults: offer.maxAdults,
      price: offer.price,
      goods: offer.goods,
      authorId: user.id,
      lat: offer.lat,
      lon: offer.lon,
    });
  }

  public async execute(
    filename: string,
    login: string,
    password: string,
    host: string,
    dbname: string,
    salt: string,
  ): Promise<void> {
    const uri = getMongoURI(login, password, host, DEFAULT_DB_PORT, dbname);
    this.salt = salt;

    await this.databaseClient.connect(uri);
    const fileReader = new TSVFileReader(filename.trim());

    fileReader.on('completeRow', this.handleImportLine);
    fileReader.on('readingFinished', this.handleCompleteImport);

    try {
      await fileReader.read();
    } catch (error) {
      this.logger.error(
        `
          Can't import data from file: ${chalk.green(filename)}
          Details:
      `,
        error,
      );
    }
  }
}
