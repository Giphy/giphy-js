import styled from '@emotion/styled'
import { giphyLightestGrey } from '@giphy/js-brand'
import { GiphyFetch } from '@giphy/js-fetch-api'
import { IGif } from '@giphy/js-types'
import { boolean, text, withKnobs } from '@storybook/addon-knobs'
import React, { useEffect, useState } from 'react'
import { jsxDecorator } from 'storybook-addon-jsx'
import { Attribution as AttributionComponent, Gif } from '../src'

const Container = styled.div`
    font-family: interface;
    h3 {
        color: ${giphyLightestGrey};
    }
`

const Gifs = styled.div`
    display: flex;
    .${Gif.className} {
        margin-right: 10px;
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
        <Container>
            <h3>Standalone attribution</h3>
            <AttributionComponent gif={makeDummy({ ...gif })} />
            <h3>Attribution in GIF component</h3>
            <Gifs>
                <Gif gif={makeDummy({ ...gif })} width={248} />
                <Gif gif={makeDummy({ ...gif })} width={448} />
            </Gifs>
        </Container>
    ) : (
        <div>Loading...</div>
    )
}
