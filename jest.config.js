module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/tests/**/*.ts',
    '!<rootDir>/src/types/**/*.ts',
    '!<rootDir>/src/cli.ts',
  ],
  collectCoverage: true,
  globals: {
    'ts-jest': {
      diagnostics: false,
      isolatedModules: true,
    },
  },
};
