import { Config } from './config.interface.js';
import { Logger } from '../logger/logger.interface.js';
import { config as dotenvConfig } from 'dotenv';
import { RestSchema, configRestSchema } from './rest.schema.js';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/component.enum.js';

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
