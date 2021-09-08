const isPercy = process.env.NODE_ENV === 'PERCY' // isPercy package doesn't work here

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
        isPercy &&
        `video {
            opacity: 0 !important;
        }
        .hide-in-percy {
            visibility: hidden;
        }
        `
    }
    
    </style>
  `,
}
