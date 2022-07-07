import { IGif } from '@giphy/js-types'
import { css } from '@emotion/css'
import { h } from 'preact'
import { useRef } from 'preact/hooks'
import Attribution from '.'

const backgroundCss = css`
    background: linear-gradient(rgba(0, 0, 0, 0), rgba(18, 18, 18, 0.6));
    cursor: default;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 75px;
    pointer-events: none;
`

const attributionCss = css`
    position: absolute;
    bottom: 10px;
    left: 10px;
    right: 10px;
`

const containerCss = css`
    transition: opacity 150ms ease-in;
`

const AttributionOverlay = ({
    gif,
    isHovered,
    onClick,
}: {
    gif: IGif
    isHovered: boolean
    onClick?: (gif: IGif) => void
}) => {
    const hasHovered = useRef(isHovered)
    if (isHovered) {
        // not rendering to avoid loading the avatar until hover
        hasHovered.current = true
    }
    return gif.user && hasHovered.current ? (
        <div className={containerCss} style={{ opacity: isHovered ? 1 : 0 }}>
            <div className={backgroundCss} />
            <Attribution gif={gif} className={attributionCss} onClick={onClick} />
        </div>
    ) : null
}

export default AttributionOverlay
