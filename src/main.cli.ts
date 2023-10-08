#!/usr/bin/env node
import {
  CLIApplication,
  GenerateCommand,
  HelpCommand,
  ImportCommand,
  VersionCommand,
} from './cli/index.js';

const bootstrap = () => {
  const cliApplication = new CLIApplication();

  cliApplication.registerCommands([
    new HelpCommand(),
    new VersionCommand(),
    new ImportCommand(),
    new GenerateCommand(),
  ]);

  cliApplication.executeCommand(process.argv);
};

bootstrap();
