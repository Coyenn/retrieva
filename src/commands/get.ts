import { Command } from 'commander';
import {
  assumeProjectHasRetrieverConfig,
  goToCurrentProjectRoot,
} from '../utils/project';
import { simpleGit } from 'simple-git';
import fs from 'fs';
import copyRecursiveSync from '../utils/copy-recursive-sync';
import { exit } from 'process';

function getComponent(component: string) {
  goToCurrentProjectRoot();
  assumeProjectHasRetrieverConfig();

  const config = require(`${process.cwd()}/retriever.json`);
  const repository = config.components.repository;
  const targetPath = config.target.path.replace(/^\.\//, '');
  const resolvedTargetPath = `${process.cwd()}/${targetPath}/${component}`;
  const logTargetPath = `${targetPath}/${component}`;

  if (fs.existsSync(resolvedTargetPath)) {
    console.error(`The component ${component} is already in ${logTargetPath}`);
    exit(1);
  }

  console.log(`Getting ${component} from ${repository}`);

  try {
    fs.rmdirSync('/tmp/retriever-tmp-git-repo', { recursive: true });
  } catch (e) {
    // Ignore
  }

  simpleGit()
    .clone(repository, '/tmp/retriever-tmp-git-repo')
    .then(() => {
      process.chdir('/tmp/retriever-tmp-git-repo/components');

      simpleGit()
        .checkout(config.components.branch)
        .then(() => {
          console.log(`Copying ${component} to ${logTargetPath}`);
          process.chdir(component);

          if (!fs.existsSync(resolvedTargetPath)) {
            fs.mkdirSync(resolvedTargetPath, { recursive: true });
          }

          fs.readdirSync('.').forEach(file => {
            copyRecursiveSync(file, `${resolvedTargetPath}/${file}`);
          });

          fs.rmdirSync('/tmp/retriever-tmp-git-repo', { recursive: true });

          console.log('Done!');
        });
    });
}

const getCommand = new Command('get')
  .description('Get a component from the remote repository')
  .arguments('<component>')
  .action(getComponent);

export default getCommand;
