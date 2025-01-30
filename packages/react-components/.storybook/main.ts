import { dirname, join } from 'path'
import type { StorybookConfig } from '@storybook/react-vite'
const config: StorybookConfig = {
    stories: ['../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)'],

    addons: [
        getAbsolutePath('@storybook/addon-links'),
        getAbsolutePath('@storybook/addon-essentials'),
        getAbsolutePath('@storybook/addon-onboarding'),
        getAbsolutePath('@storybook/addon-interactions'),
        getAbsolutePath('@storybook/addon-viewport'),
        '@chromatic-com/storybook',
    ],

    framework: {
        name: getAbsolutePath('@storybook/react-vite'),
        options: {},
    },

    docs: {},

    core: {},

    typescript: {
        reactDocgen: 'react-docgen-typescript',
    },
}
export default config

function getAbsolutePath(value: string): any {
    return dirname(require.resolve(join(value, 'package.json')))
}
