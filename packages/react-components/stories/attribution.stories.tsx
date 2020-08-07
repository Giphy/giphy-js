import { giphyLightestGrey } from '@giphy/js-brand'
import { GiphyFetch } from '@giphy/js-fetch-api'
import { IGif } from '@giphy/js-types'
import { boolean, text, withKnobs } from '@storybook/addon-knobs'
import { css } from 'emotion'
import React, { useEffect, useState } from 'react'
import { jsxDecorator } from 'storybook-addon-jsx'
import { Attribution as AttributionComponent, Gif } from '../src'

const gifCss = css`
    margin-right: 10px;
`

const containerCss = css`
    font-family: interface;
    h3 {
        color: ${giphyLightestGrey};
    }
`

const gf = new GiphyFetch('sXpGFDGZs0Dv1mmNFvYaGUvYwKX0PWIh')

export default {
    title: 'React Components/Attribution',
    decorators: [withKnobs, jsxDecorator],
}

const makeDummy = (gif: IGif) => {
    gif.user = {
        ...gif.user,
        display_name: text('Display Name', 'Lorem ipsum dolor sit amet consectetur adipiscing elit'),
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
            const { data } = await gf.gif(text('gif id', 'l0HlyLQsbvhciAuKA'))
            setGif(data)
        }
        f()
    }, [])
    return gif ? (
        <div className={containerCss}>
            <h3>Standalone attribution</h3>
            <AttributionComponent gif={makeDummy({ ...gif })} />
            <h3>Attribution in GIF component</h3>
            <div style={{ display: 'flex' }}>
                <Gif gif={makeDummy({ ...gif })} width={248} className={gifCss} />
                <Gif gif={makeDummy({ ...gif })} width={448} />
            </div>
        </div>
    ) : (
        <div>Loading...</div>
    )
}
