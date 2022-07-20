import { defineConfig } from 'cypress'

export default defineConfig({
    requestTimeout: 30000,
    video: false,
    viewportWidth: 1100,
    env: {
        NODE_ENV: 'cypress',
    },
    retries: {
        runMode: 2,
        openMode: 0,
    },
    component: {
        specPattern: ['cypress/**/*.spec.tsx', 'cypress/**/*.spec.ts'],
        devServer: {
            framework: 'react',
            bundler: 'webpack',
            webpackConfig: require('./cypress/webpack.config'),
        },
    },
})
