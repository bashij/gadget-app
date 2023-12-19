import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
const config = {
  // Add more setup options before each test is run
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  testEnvironment: 'jest-environment-jsdom',

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  globalSetup: '<rootDir>/__tests__/setupEnv.js',

  testPathIgnorePatterns: [
    // 設定ファイル
    '<rootDir>/__tests__/setupEnv.js',
    // ダミーデータファイル
    '<rootDir>/__tests__/communities/dummyData.js',
    '<rootDir>/__tests__/tweets/dummyData.js',
    '<rootDir>/__tests__/gadgets/dummyData.js',
    '<rootDir>/__tests__/users/dummyData.js',
  ],

  // タイムアウトを10秒に設定
  testTimeout: 10000,
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config)
