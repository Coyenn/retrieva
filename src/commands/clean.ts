import { Command } from 'commander';
import { enforceProjectConfig, goToCurrentProjectRoot } from '../utils/project';
import fs from 'fs';
import defaultConfig from '../utils/default-config';
import path from 'path';
import { exit } from 'process';

async function cleanComponent() {
  const { default: ora } = await import('ora');

  goToCurrentProjectRoot();
  enforceProjectConfig();

  const projectRootPath = process.cwd();
  const config = require(
    path.resolve(projectRootPath, 'retrieva.json')
  ) as typeof defaultConfig;
  const target = path.resolve(config.target.path);

  const spinner = ora(`Cleaning ${config.target.path}...\n`).start();

  if (!fs.existsSync(target)) {
    spinner.fail(`The target ${config.target.path} does not exist`);
    exit(1);
  }

  fs.readdirSync(target).forEach(file => {
    try {
      fs.rmSync(path.resolve(target, file), { recursive: true });
    } catch (e) {
      spinner.warn(`Could not remove ${file}`);
    }
  });

  spinner.succeed(`Cleaned ${config.target.path}`);
}

const cleanCommand = new Command('clean')
  .description('Clears all installed components')
  .action(cleanComponent);

export default cleanCommand;
