import type { Config } from "jest";
import nextJest from "next/jest.js";

// COMAND REQUIRED TO RUN TESTS
// npm install --save-dev ts-node

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
  // Other configuration options...
});

// Add any custom config to be passed to Jest
const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  setupFiles: ["./jest.setup.js"],
  // Add more setup options before each test is run
  // setupFilesAfterEnv: ["./jest.setupAfter.js"],
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    "^next/router$": "<rootDir>/__mocks__/next/router.js",
  },
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
