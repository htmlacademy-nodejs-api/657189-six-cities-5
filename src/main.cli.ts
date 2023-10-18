#!/usr/bin/env node
// eslint-disable-next-line node/file-extension-in-import
import 'module-alias/register';
import 'reflect-metadata';
import { CLIApplication } from './cli/cli.js';
import { HelpCommand, VersionCommand, ImportCommand, GenerateCommand } from './cli/index.js';


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
