const base = require('./jestconfig-base.js')

module.exports = {
    ...base,
    projects: ['<rootDir>/packages/*/jest.config.js'],
    coverageDirectory: '<rootDir>/coverage/',
}
