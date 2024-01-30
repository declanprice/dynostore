module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/integration'],
  testMatch: ['**/*.spec.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  }
}
