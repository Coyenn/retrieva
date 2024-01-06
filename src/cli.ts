import { Command } from 'commander';
import initCommand from './commands/init';
import getCommand from './commands/get';
import cleanCommand from './commands/clean';
import listCommand from './commands/list';

const packageJson = require('../package.json');
const version: string = packageJson.version;

const program = new Command();

program
  .version(version)
  .name('retrieva')
  .addCommand(initCommand)
  .addCommand(getCommand)
  .addCommand(cleanCommand)
  .addCommand(listCommand)
  .parse(process.argv);
