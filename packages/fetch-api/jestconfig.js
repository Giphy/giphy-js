import base from '../../jestconfig-base.js'

export default {
    ...base,
    displayName: 'fetch-api',
    testEnvironment: 'jsdom',
    setupFiles: ['./set-up-jest.ts'],
}
