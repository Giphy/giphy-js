// Jest configuration for api
import base from '../../jestconfig-base.js'

export default {
    ...base,
    displayName: 'util',
    testEnvironment: 'jsdom',
    setupFiles: ['./browser-mock.ts'],
}
