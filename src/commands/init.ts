import { Command } from 'commander';
import {
  goToCurrentProjectRoot,
  projectHasRetrievaConfig,
} from '../utils/project';
import fs from 'fs';
import defaultConfig from '../utils/default-config';

function initializeProject() {
  goToCurrentProjectRoot();

  if (projectHasRetrievaConfig()) {
    console.log(
      'The retrieva.json already exists in your project. Remove it to create a new one.'
    );
    return;
  } else {
    fs.writeFileSync('retrieva.json', JSON.stringify(defaultConfig, null, 2));
    console.log('Wrote config to retrieva.json. Edit it to your needs.');
  }
}

const initCommand = new Command('init')
  .description('Creates a new config for a project')
  .action(initializeProject);

export default initCommand;
