const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './src',
})

// Add any custom config to be passed to Jest
const customJestConfig = {    
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  // workaround for the yup resolver error when running test
  resolver: '<rootDir>/.jest/resolvers.js',
  moduleNameMapper: {
    // Handle module aliases (this will be automatically configured for you soon)
    '^@components-core/(.*)$': '<rootDir>/src/components-core/$1',
    '^@components-feat': '<rootDir>/src/components-feat/index.ts',
    '^@components-common': '<rootDir>/src/components-common/index.ts',
    '^@lib/(.*)$': '<rootDir>/src/lib/$1',
    '^@models': '<rootDir>/src/models/index.ts',
    '^@styles/(.*)$': '<rootDir>/src/styles/$1',
    '^@utils': '<rootDir>/src/utils/index.ts',
  },
  testEnvironment: 'jest-environment-jsdom',
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)

