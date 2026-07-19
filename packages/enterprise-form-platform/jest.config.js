module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  collectCoverage: true,
  coverageDirectory: "coverage",
  collectCoverageFrom: ["src/**/*.{ts,tsx}", "!src/**/*.test.{ts,tsx}", "!src/demo/**", "!src/tests/setup.ts"],
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/src/$1' }
};
