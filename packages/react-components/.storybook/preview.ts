// .storybook/preview.ts

import { MINIMAL_VIEWPORTS } from '@storybook/addon-viewport'
import { Preview } from '@storybook/react'

const preview: Preview = {
    parameters: {
        viewport: {
            viewports: MINIMAL_VIEWPORTS,
        },
    },
}

export default preview
