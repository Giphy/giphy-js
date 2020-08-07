import { addParameters, configure } from '@storybook/react'
import { themes } from '@storybook/theming'

addParameters({
    options: {
        theme: themes.dark,
    },
})
// automatically import all files ending in *.stories.js
configure(require.context('../stories', true, /\.stories\.tsx$/), module)
