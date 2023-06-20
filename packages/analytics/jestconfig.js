// Jest configuration for api
import base from '../../jestconfig-base.js'

export default {
    ...base,
    displayName: 'analytics',
    testEnvironment: 'jsdom',
    setupFiles: ['./set-up-jest.ts'],
}
