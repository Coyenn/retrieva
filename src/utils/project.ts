import fs from 'fs';
import path from 'path';

export function getCurrentProjectRoot() {
  return process.cwd();
}

export function goToCurrentProjectRoot() {
  process.chdir(getCurrentProjectRoot());
}

export function projectHasRetrievaConfig() {
  return fs.existsSync(path.resolve(getCurrentProjectRoot(), 'retrieva.json'));
}

export function assumeProjectHasRetrievaConfig() {
  if (!projectHasRetrievaConfig()) {
    console.log(
      'No retrieva.json found in your project. Run retrieva init to create one.'
    );
    process.exit(1);
  }
}
