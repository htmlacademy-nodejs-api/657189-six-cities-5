import { Command } from '../cli/commands/command.interface.js';

type CommandCollection = Record<string, Command>;
type ParsedCommand = Record<string, string[]>;

export class CLIApplication {
  private commands: CommandCollection = {};
  private readonly defaultCommand = '--help';

  private parseCommand(cliArguments: string[]): ParsedCommand {
    let commandName = '';

    return cliArguments.reduce((acc, argument) => {
      const isCommandArg = argument.startsWith('--');

      if (isCommandArg) {
        acc[argument] = [];
        commandName = argument;
      } else if (commandName && argument) {
        acc[commandName].push(argument);
      }

      return acc;
    }, {} as ParsedCommand);
  }

  public registerCommands(commandList: Command[]): void {
    for (const command of commandList) {
      const commandName = command.getName();

      if (Object.hasOwn(this.commands, commandName)) {
        throw new Error(`Command ${commandName} is already registered`);
      }
      this.commands[commandName] = command;
    }
  }

  public getCommand(commandName: string): Command {
    return this.commands[commandName] ?? this.getDefaultCommand();
  }

  public getDefaultCommand(): Command | never {
    if (!this.commands[this.defaultCommand]) {
      throw new Error(
        `The default command (${this.defaultCommand}) is not registration`
      );
    }
    return this.commands[this.defaultCommand];
  }

  public executeCommand(argv: string[]): void {
    const parsedCommand = this.parseCommand(argv);
    const [commandName] = Object.keys(parsedCommand);
    const command = this.getCommand(commandName);
    const commandArguments = parsedCommand[commandName] ?? [];
    command.execute(...commandArguments);
  }
}
