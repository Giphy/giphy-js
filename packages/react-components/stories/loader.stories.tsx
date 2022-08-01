import React from 'react'
import DotsLoader_ from '../src/components/loader'
import { Story } from '@storybook/react'

export default {
    title: 'React Components/Loader',
}

type DotsLoaderProps = React.ComponentProps<typeof DotsLoader_>

type StoryProps = Partial<DotsLoaderProps>

export const DotsLoader: Story<StoryProps> = (props) => {
    return <DotsLoader_ {...props} />
}
