import { IGif } from '@giphy/js-types'
import { css } from 'emotion'
import React from 'react'
import Attribution from '.'
const backgroundCss = css`
    background: linear-gradient(rgba(0, 0, 0, 0), rgba(18, 18, 18, 0.6));
    cursor: default;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 70px;
    pointer-events: none;
`

const attributionCss = css`
    position: absolute;
    bottom: 5px;
    left: 5px;
    right: 5px;
`

// minor fade in
// don't want to load the avatar until hover and keeping this simple
const containerCss = css`
    transition: opacity 150ms ease-in;
`

type Props = { gif: IGif; isVisible: boolean }

const AttributionInGif = ({ gif, isVisible }: Props) => {
    return gif.user ? (
        <div className={containerCss} style={{ opacity: isVisible ? 1 : 0 }}>
            <div className={backgroundCss} />
            {isVisible && <Attribution gif={gif} className={attributionCss} />}
        </div>
    ) : null
}

export default AttributionInGif
