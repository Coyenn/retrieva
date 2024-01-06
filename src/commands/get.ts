import { Command } from 'commander';
import {
  assumeProjectHasRetrievaConfig,
  goToCurrentProjectRoot,
} from '../utils/project';
import { simpleGit } from 'simple-git';
import fs from 'fs';
import copyRecursiveSync from '../utils/copy-recursive-sync';

function copyComponent(
  component: string,
  repository: string,
  targetPath: string
) {
  console.log(`Getting ${component} from ${repository}`);

  const componentSourcePath = `/tmp/retrieva-tmp-git-repo/components/${component}`;
  const componentTargetPath = `${targetPath}/${component}`;
  const logTargetPath = `${targetPath}/${component}`;

  if (!fs.existsSync(componentSourcePath)) {
    console.error(`The component ${component} does not exist in ${repository}`);
    return;
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

  const config = require(`${process.cwd()}/retrieva.json`);
  const repository = config.components.repository;
  const targetPath = `${process.cwd()}/${config.target.path.replace(
    /^\.\//,
    ''
  )}`;

  try {
    fs.rmSync('/tmp/retrieva-tmp-git-repo', { recursive: true });
  } catch (e) {
    // Ignore
  }

  console.log(`Cloning ${repository}...`);
  simpleGit()
    .clone(repository, '/tmp/retrieva-tmp-git-repo')
    .then(() => {
      simpleGit()
        .checkout(config.components.branch)
        .then(() => {
          if (typeof components === 'string') {
            copyComponent(components, repository, targetPath);
          } else {
            components.forEach(component =>
              copyComponent(component, repository, targetPath)
            );
          }

          fs.rmSync('/tmp/retrieva-tmp-git-repo', { recursive: true });

          console.log('Done!');
        });
    });
}

const getCommand = new Command('get')
  .description('Get one or more components from the remote repository')
  .arguments('<components...>')
  .action(getComponent);

export default getCommand;
