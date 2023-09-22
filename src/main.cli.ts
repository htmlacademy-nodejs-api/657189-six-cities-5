#!/usr/bin/env node
import {
  CLIApplication,
  HelpCommand,
  ImportCommand,
  VersionCommand,
} from './cli/index.js';

const cliApplication = new CLIApplication();

cliApplication.registerCommands([
  new HelpCommand(),
  new VersionCommand(),
  new ImportCommand(),
]);

cliApplication.executeCommand(process.argv);
