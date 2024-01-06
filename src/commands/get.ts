import { Command } from 'commander';
import {
  assumeProjectHasRetrievaConfig,
  goToCurrentProjectRoot,
} from '../utils/project';
import { simpleGit } from 'simple-git';
import fs from 'fs';
import copyRecursiveSync from '../utils/copy-recursive-sync';
import defaultConfig from '../utils/default-config';
import path from 'path';
import { exit } from 'process';
import { globSync } from 'glob';

function copyComponent(
  component: string,
  projectRootPath: string,
  config: typeof defaultConfig,
  spinner: any
) {
  const repository = config.source.repository;
  const targetPath = path.resolve(
    projectRootPath,
    path.normalize(config.target.path)
  );
  const fetchTempDirectory = path.resolve(config.fetchTempDirectory);
  const sourcePath = path.resolve(
    fetchTempDirectory,
    path.normalize(config.source.path)
  );

  let componentSourcePath = path.resolve(sourcePath, component);
  let componentType: 'directory' | 'file' = 'directory';
  let componentTargetPath = path.resolve(targetPath, component);
  const logTargetPath = path.relative(projectRootPath, componentTargetPath);

  if (!fs.existsSync(componentSourcePath)) {
    componentSourcePath = globSync(`${componentSourcePath}.*`)[0]; // The component could be a file, not a directory
    componentTargetPath = path.resolve(
      targetPath,
      component + path.extname(componentSourcePath)
    );
    componentType = 'file';

    if (!fs.existsSync(componentSourcePath)) {
      spinner.error(
        `The component ${component} does not exist in ${repository}`
      );
      exit(1);
    }
  }

  if (fs.existsSync(componentTargetPath)) {
    spinner.warn(`The component ${component} is already in ${logTargetPath}`);
    return;
  }

  if (componentType === 'directory') {
    if (!fs.existsSync(componentTargetPath)) {
      fs.mkdirSync(componentTargetPath, { recursive: true });
    }

    fs.readdirSync(componentSourcePath).forEach(file => {
      copyRecursiveSync(
        path.resolve(componentSourcePath, file),
        `${componentTargetPath}/${file}`
      );
    });
  } else {
    fs.copyFileSync(componentSourcePath, componentTargetPath);
  }
}

async function getComponent(components: string | string[]) {
  const { default: ora } = await import('ora');

  goToCurrentProjectRoot();
  assumeProjectHasRetrievaConfig();

  const projectRootPath = process.cwd();
  const config = require(
    path.resolve(projectRootPath, 'retrieva.json')
  ) as typeof defaultConfig;
  const repository = config.source.repository;
  const fetchTempDirectory = path.resolve(config.fetchTempDirectory);

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
        .checkout(config.source.checkout)
        .then(() => {
          if (typeof components === 'string') {
            spinner.text = `Retrieving ${components}...`;
            copyComponent(components, projectRootPath, config, spinner);
          } else {
            components.forEach(component => {
              spinner.text = `Retrieving ${component}...`;
              copyComponent(component, projectRootPath, config, spinner);
            });
          }

          spinner.succeed(
            `Retrieved ${
              typeof components === 'string'
                ? components
                : components.join(', ')
            }`
          );
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

const getCommand = new Command('get')
  .description('Get one or more components')
  .arguments('<components...>')
  .action(getComponent);

export default getCommand;
