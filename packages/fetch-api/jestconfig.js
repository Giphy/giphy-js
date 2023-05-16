// Jest configuration for api
const base = require('../../jestconfig-base.js')

module.exports = {
    ...base,
    displayName: 'fetch-api',
    automock: false,
    setupFiles: ['./set-up-jest.ts'],
}
