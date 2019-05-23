module.exports = {
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  preset: 'ts-jest',
  testEnvironment: 'node',
  testRegex: `.*src/.*.(test|spec).(jsx?|tsx?)$`,
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverage: false,
  coveragePathIgnorePatterns: ['(tests/.*.mock).(jsx?|tsx?)$'],
}
