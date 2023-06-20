// const isTestsRunner = process.env.NODE_ENV === 'PERCY' || (typeof window !== 'undefined' && !!window.Cypress) // is-tests-runner package doesn't work here

export default {
    stories: ['../**/*.stories.tsx'],
    addons: [
        'storybook-addon-jsx/register',
        '@storybook/addon-viewport/register',
        '@storybook/addon-actions/register',
        '@storybook/addon-knobs',
    ],
    reactOptions: {
        strictMode: true,
    },
}
