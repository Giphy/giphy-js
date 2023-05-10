// Jest configuration for api
const base = require('../../jestconfig-base.js')

module.exports = {
    ...base,
    displayName: 'util',
    testEnvironment: 'jsdom',
    setupFiles: ['./browser-mock.ts'],
}
