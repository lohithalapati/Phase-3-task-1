module.exports = {
  "preset": "ts-jest",
  "testEnvironment": "node",
  "testMatch": [
    "**/tests/**/*.spec.ts"
  ],
  "collectCoverage": true,
  "coverageDirectory": "coverage",
  "coverageReporters": [
    "text",
    "lcov"
  ],
  "transform": {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        "tsconfig": {
          "target": "es2020",
          "module": "commonjs"
        }
      }
    ]
  }
};