const isPercy = require('@percy-io/in-percy')

module.exports = {
    stories: ['../**/*.stories.tsx'],
    addons: [
        'storybook-addon-jsx/register',
        '@storybook/addon-viewport/register',
        '@storybook/addon-actions/register',
        '@storybook/addon-knobs',
    ],
    previewHead: (head) => `
    ${head}
    <style>
    ${
        isPercy() &&
        `video {
            opacity: 0 !important;
        }`
    }
    
    </style>
  `,
}
