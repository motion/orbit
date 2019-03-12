// Jest configuration for api
const base = require('../../jest.config.base.js')

module.exports = {
  ...base,
  name: 'orbit-app',
  displayName: 'orbit-app',
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.json',
    },
  },
}
