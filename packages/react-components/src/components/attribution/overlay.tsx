import { css } from 'emotion'
import React, { useRef } from 'react'
import Attribution from '.'
import { GifOverlayProps } from '../gif'
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

const containerCss = css`
    transition: opacity 150ms ease-in;
`

const AttributionOverlay = ({ gif, isHovered }: GifOverlayProps) => {
    const hasHovered = useRef(isHovered)
    if (isHovered) {
        // not rendering to avoid loading the avatar until hover
        hasHovered.current = true
    }
    return gif.user && hasHovered.current ? (
        <div className={containerCss} style={{ opacity: isHovered ? 1 : 0 }}>
            <div className={backgroundCss} />
            <Attribution gif={gif} className={attributionCss} />
        </div>
    ) : null
}

export default AttributionOverlay
