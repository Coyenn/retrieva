import { Command } from 'commander';
import {
  assumeProjectHasRetrievaConfig,
  goToCurrentProjectRoot,
} from '../utils/project';
import { simpleGit } from 'simple-git';
import fs from 'fs';
import defaultConfig from '../utils/default-config';
import path from 'path';

async function listComponent() {
  const { default: ora } = await import('ora');

  goToCurrentProjectRoot();
  assumeProjectHasRetrievaConfig();

  const projectRootPath = process.cwd();
  const config = require(
    path.resolve(projectRootPath, 'retrieva.json')
  ) as typeof defaultConfig;
  const repository = config.source.repository;
  const fetchTempDirectory = path.resolve(config.fetchTempDirectory);
  const sourcePath = path.resolve(
    fetchTempDirectory,
    path.normalize(config.source.path)
  );

  try {
    fs.rmSync(fetchTempDirectory, { recursive: true });
  } catch (e) {
    // Ignore
  }

  const spinner = ora(`Fetching ${repository}...\n`).start();

  simpleGit()
    .clone(repository, fetchTempDirectory)
    .then(() => {
      simpleGit()
        .checkout(config.source.branch)
        .then(() => {
          spinner.succeed(`Fetched ${repository}`);

          const components = fs.readdirSync(sourcePath);

          console.log('Available components:');
          components.forEach(component => {
            // if component is a file (not a directory), print it without the file extension
            console.log(`- ${component.replace(/\.[^/.]+$/, '')}`);
          });
        })
        .finally(() => {
          try {
            spinner.clear();
            spinner.stop();
            fs.rmSync(fetchTempDirectory, { recursive: true });
          } catch (e) {
            console.error(e);
          }
        });
    });
}

const listCommand = new Command('list')
  .description('List all available components')
  .action(listComponent);

export default listCommand;
