import { Command } from 'commander';
import {
  getCurrentProjectRoot,
  goToCurrentProjectRoot,
  projectHasRetrievaConfig,
} from '../utils/project';
import fs from 'fs';
import defaultConfig from '../utils/default-config';
import path from 'path';

function initializeProject() {
  goToCurrentProjectRoot();

  if (projectHasRetrievaConfig()) {
    console.log(
      'The retrieva.json already exists in your project. Remove it to create a new one.'
    );
    return;
  } else {
    fs.writeFileSync(
      path.resolve(getCurrentProjectRoot(), 'retrieva.json'),
      JSON.stringify(defaultConfig, null, 2)
    );
    console.log('Wrote config to retrieva.json. Edit it to your needs.');
  }
}

const initCommand = new Command('init')
  .description('Creates a new retrieva.json config in the current directory')
  .action(initializeProject);

export default initCommand;
