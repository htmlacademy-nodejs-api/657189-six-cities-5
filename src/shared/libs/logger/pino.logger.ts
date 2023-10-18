import { Logger as PinoInstance, pino, transport } from 'pino';
import { injectable } from 'inversify';
import { resolve } from 'node:path';

import { Logger } from './logger.interface.js';
import { getCurrentModuleDirectoryPath } from '../../helpers/index.js';

const SOURCE_PATH = '../../../';

@injectable()
export class PinoLogger implements Logger {
  private readonly logger: PinoInstance;

  constructor() {
    const modulePath = getCurrentModuleDirectoryPath();
    const logFIlePath = 'logs/rest.log';
    const destination = resolve(modulePath, SOURCE_PATH, logFIlePath);

    const fileTransport = transport({
      targets: [
        {
          target: 'pino/file',
          options: { destination },
          level: 'debug',
        },
        {
          target: 'pino/file',
          options: {},
          level: 'info',
        },
      ],
    });

    this.logger = pino({}, fileTransport);
    this.info('Logger initialized');
  }

  public debug(message: string, ...args: unknown[]): void {
    this.logger.debug(message, ...args);
  }

  public error(message: string, error: unknown, ...args: unknown[]): void {
    this.logger.error(error, message, ...args);
  }

  public info(message: string, ...args: unknown[]): void {
    this.logger.info(message, ...args);
  }

  public warn(message: string, ...args: unknown[]): void {
    this.logger.warn(message, ...args);
  }
}
