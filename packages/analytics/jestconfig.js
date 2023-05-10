// Jest configuration for api
const base = require('../../jestconfig-base.js')

module.exports = {
    ...base,
    displayName: 'analytics',
    automock: false,
    setupFiles: ['./set-up-jest.ts'],
}
