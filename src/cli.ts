import { Command } from 'commander';
import initCommand from './commands/init';
import getCommand from './commands/get';

const packageJson = require('../package.json');
const version: string = packageJson.version;

const program = new Command();

program
  .version(version)
  .name('retrieva')
  .option('-d, --debug', 'enables verbose logging', false)
  .addCommand(initCommand)
  .addCommand(getCommand)
  .parse(process.argv);
