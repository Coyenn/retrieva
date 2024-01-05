import fs from 'fs';

export function getCurrentProjectRoot() {
  return process.cwd();
}

export function goToCurrentProjectRoot() {
  process.chdir(getCurrentProjectRoot());
}

export function projectHasRetrieverConfig() {
  return fs.existsSync('retriever.json');
}

export function assumeProjectHasRetrieverConfig() {
  if (!projectHasRetrieverConfig()) {
    console.log('No retriever.json found in your project. Run retriever init to create one.');
    process.exit(1);
  }
}
