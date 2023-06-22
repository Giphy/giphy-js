import base from '../../jestconfig-base.js'

export default {
    ...base,
    displayName: 'fetch-api',
    automock: false,
    setupFiles: ['./set-up-jest.ts'],
}
