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

function copyComponent(
  component: string,
  projectRootPath: string,
  config: typeof defaultConfig
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

  console.log(`Getting ${component} from ${repository}`);

  const componentSourcePath = path.resolve(sourcePath, component);
  const componentTargetPath = path.resolve(targetPath, component);
  const logTargetPath = path.relative(projectRootPath, componentTargetPath);

  if (!fs.existsSync(componentSourcePath)) {
    console.error(`The component ${component} does not exist in ${repository}`);
    exit(1);
  }

  if (fs.existsSync(componentTargetPath)) {
    console.warn(`The component ${component} is already in ${logTargetPath}`);
    return;
  }

  process.chdir(componentSourcePath);

  if (!fs.existsSync(componentTargetPath)) {
    fs.mkdirSync(componentTargetPath, { recursive: true });
  }

  fs.readdirSync('.').forEach(file => {
    copyRecursiveSync(file, `${componentTargetPath}/${file}`);
  });
}

function getComponent(components: string | string[]) {
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

  console.log(`Fetching ${repository}...`);
  simpleGit()
    .clone(repository, fetchTempDirectory)
    .then(() => {
      simpleGit()
        .checkout(config.source.branch)
        .then(() => {
          if (typeof components === 'string') {
            copyComponent(components, projectRootPath, config);
          } else {
            components.forEach(component =>
              copyComponent(component, projectRootPath, config)
            );
          }

          console.log('Done!');
        })
        .finally(() => {
          try {
            fs.rmSync(fetchTempDirectory, { recursive: true });
          } catch (e) {
            console.error(e);
          }
        });
    });
}

const getCommand = new Command('get')
  .description('Get one or more components from the remote repository')
  .arguments('<components...>')
  .action(getComponent);

export default getCommand;
