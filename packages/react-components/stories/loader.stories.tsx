import React, { ComponentProps } from 'react'
import DotsLoader_ from '../src/components/loader'

export default {
    title: 'React Components/Loader',
}

export const DotsLoader = (props: ComponentProps<typeof DotsLoader_>) => {
    return <DotsLoader_ {...props} />
}
