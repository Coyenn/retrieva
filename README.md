# retriever

> Boilerplate to kickstart creating a Node.js command-line tool

Inspired by [node-cli-boilerplate](https://github.com/sindresorhus/node-cli-boilerplate)

## Getting started

### Set up your repository

**Click the "Use this template" button.**

Alternatively, create a new directory and then run:

```bash
curl -fsSL https://github.com/ryansonshine/retriever/archive/main.tar.gz | tar -xz --strip-components=1
```

Replace `FULL_NAME`, `GITHUB_USER`, and `REPO_NAME` in the script below with your own details to personalize your new package:

```bash
FULL_NAME="John Smith"
GITHUB_USER="johnsmith"
REPO_NAME="my-cool-package"
sed -i.mybak "s/\([\/\"]\)(ryansonshine)/$GITHUB_USER/g; s/retriever\|retriever/$REPO_NAME/g; s/Tim Ritter/$FULL_NAME/g" package.json package-lock.json README.md
rm *.mybak
```

### Add NPM Token

Add your npm token to your GitHub repository secrets as `NPM_TOKEN`.

### Add Codecov integration

Enable the Codecov GitHub App [here](https://github.com/apps/codecov).

**Remove everything from here and above**

---

# retriever

[![npm package][npm-img]][npm-url]
[![Build Status][build-img]][build-url]
[![Downloads][downloads-img]][downloads-url]
[![Issues][issues-img]][issues-url]
[![Code Coverage][codecov-img]][codecov-url]
[![Commitizen Friendly][commitizen-img]][commitizen-url]
[![Semantic Release][semantic-release-img]][semantic-release-url]

> My awesome command-line tool

## Install

```bash
npm install retriever
```

## Usage

```bash
Usage: my-command [options]

Options:
  -V, --version            output the version number
  -d, --debug              enables verbose logging (default: false)

Examples:

  $ my-command --version
  1.0.0
```

[build-img]:https://github.com/ryansonshine/retriever/actions/workflows/release.yml/badge.svg
[build-url]:https://github.com/ryansonshine/retriever/actions/workflows/release.yml
[downloads-img]:https://img.shields.io/npm/dt/retriever
[downloads-url]:https://www.npmtrends.com/retriever
[npm-img]:https://img.shields.io/npm/v/retriever
[npm-url]:https://www.npmjs.com/package/retriever
[issues-img]:https://img.shields.io/github/issues/ryansonshine/retriever
[issues-url]:https://github.com/ryansonshine/retriever/issues
[codecov-img]:https://codecov.io/gh/ryansonshine/retriever/branch/main/graph/badge.svg
[codecov-url]:https://codecov.io/gh/ryansonshine/retriever
[semantic-release-img]:https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-release-url]:https://github.com/semantic-release/semantic-release
[commitizen-img]:https://img.shields.io/badge/commitizen-friendly-brightgreen.svg
[commitizen-url]:http://commitizen.github.io/cz-cli/
