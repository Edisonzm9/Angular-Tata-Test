module.exports = {
    preset: 'jest-preset-angular',
    setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
    testMatch: ['**/+(*.)+(spec).+(ts)'],
    collectCoverage: true,
    coverageReporters: ['html', 'text-summary'],
    coverageDirectory: 'coverage',
    moduleFileExtensions: ['ts', 'html', 'js', 'json'],
    testEnvironment: 'jsdom'
  };