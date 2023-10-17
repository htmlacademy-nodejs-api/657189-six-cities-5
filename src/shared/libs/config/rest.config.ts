import { config as dotenvConfig } from 'dotenv';
import { inject, injectable } from 'inversify';

import { Config } from './config.interface.js';
import { RestSchema, configRestSchema } from './rest.schema.js';
import { Logger } from '../logger/index.js';
import { Component } from '../../types/index.js';

@injectable()
export class RestConfig implements Config<RestSchema> {
  private readonly config: RestSchema;

  constructor(@inject(Component.Logger) private readonly logger: Logger) {
    const parsedOutput = dotenvConfig();

    if (parsedOutput.error) {
      throw new Error('Cannot read .env file. Looks like the file does not exist');
    }

    try {
      configRestSchema.load({});
      configRestSchema.validate({
        allowed: 'strict',
        output: this.logger.info,
      });

      this.config = configRestSchema.getProperties();
      this.logger.info('.env file found and successfully parsed!');
    } catch (error) {
      this.logger.error('Schema validation error', error);

      throw new Error('Failed to init RestConfig');
    }
  }

  public get<T extends keyof RestSchema>(key: T): RestSchema[T] {
    return this.config[key];
  }
}
