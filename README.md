# retrieva

On-demand component retrieval for TypeScript projects

## Installation

### Global

```bash
npm i -g retrieva
```

### Local

```bash
npm i -D retrieva
```

## Usage

### Initialization

Any project using retrieva must have a `retrieva.json` file in the root directory. This file contains the configuration for retrieva.

```bash
retrieva init
```

This will create a `retrieva.json` file in the current directory. Configure the file to your liking.

### Retrieval

```bash
retrieva get <component>
```
