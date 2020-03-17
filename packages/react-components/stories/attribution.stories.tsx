import { GiphyFetch } from '@giphy/js-fetch-api'
import { IGif } from '@giphy/js-types'
import { boolean, text, withKnobs } from '@storybook/addon-knobs'
import React, { useEffect, useState } from 'react'
import { jsxDecorator } from 'storybook-addon-jsx'
import { Attribution as AttributionComponent, Gif } from '../src'

const gf = new GiphyFetch('sXpGFDGZs0Dv1mmNFvYaGUvYwKX0PWIh')

export default {
    title: 'React Components|Attribution',
    decorators: [withKnobs, jsxDecorator],
}

const makeDummy = (gif: IGif) => {
    gif.user = {
        ...gif.user,
        display_name: text('Display Name', 'Looooong Nameeed Disply Name Property Still going'),
        is_verified: boolean('Verified', true),
    }
    if (!boolean('Avatar', true)) {
        gif.user.avatar_url = ''
    }
    return gif
}
export const Attribution = () => {
    const [gif, setGif] = useState<IGif | undefined>()
    useEffect(() => {
        const f = async () => {
            const { data } = await gf.gif(text('gif id', 'U7JDsNfbGF6p6ho6Mm'))
            setGif(data)
        }
        f()
    }, [])
    return gif ? (
        <div style={{ width: 250, color: 'white' }}>
            <AttributionComponent gif={gif} />
            <hr />
            <h4>Configure with Knobs</h4>
            <AttributionComponent gif={makeDummy({ ...gif })} />
            <hr />
            <h5> In GIF Component</h5>
            <Gif gif={makeDummy({ ...gif })} width={400} />
        </div>
    ) : (
        <div>Loading...</div>
    )
}
