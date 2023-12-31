import chalk from 'chalk';
import { Command } from './command.interface.js';
import { ConsoleLogger, Logger } from '../../shared/libs/logger/index.js';

const COMMANDS_TO_SHOW = {
  ['--version:']: '# выводит номер версии',
  ['--help']: '# печатает этот текст',
  ['--import <path> <login> <password> <host> <dbname> <salt>']: '# импортирует данные из TSV',
  ['--generate <n> <path> <url>']:
    '# генерирует произвольное количество тестовых объявлений в базу',
};

const DISTANCE_TO_PROMPT = 30;

export class HelpCommand implements Command {
  private logger: Logger;

  constructor() {
    this.logger = new ConsoleLogger();
  }

  public getName(): string {
    return '--help';
  }

  private generateCommandsPrompt(): string {
    return Object.entries(COMMANDS_TO_SHOW).reduce((acc, [commandName, prompt]) => {
      const spacesBetween = Math.max(DISTANCE_TO_PROMPT - commandName.length, 0);

      return acc.concat(
        `
          ${chalk.blue(commandName)} ${' '.repeat(spacesBetween)} ${prompt}
          `,
      );
    }, '');
  }

  public async execute(): Promise<void> {
    this.logger.info(`
      Программа для подготовки данных для REST API сервера.
      Пример:
          ${chalk.yellow('cli.js')} ${chalk.blue('--<command> [--arguments]')}
      Команды: \n${this.generateCommandsPrompt()}
    `);
  }
}
