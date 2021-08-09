import styled from '@emotion/styled'
import { IGif } from '@giphy/js-types'
import React, { useRef } from 'react'
import Attribution_ from '.'
import type { GifOverlayProps } from '../types'

const Background = styled.div`
    background: linear-gradient(rgba(0, 0, 0, 0), rgba(18, 18, 18, 0.6));
    cursor: default;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 75px;
    pointer-events: none;
`

const Attribution = styled(Attribution_)`
    position: absolute;
    bottom: 10px;
    left: 10px;
    right: 10px;
`

const Container = styled.div`
    transition: opacity 150ms ease-in;
`

type Props = { onClick?: (gif: IGif) => void }

const AttributionOverlay = ({ gif, isHovered, onClick }: GifOverlayProps & Props) => {
    const hasHovered = useRef(isHovered)
    if (isHovered) {
        // not rendering to avoid loading the avatar until hover
        hasHovered.current = true
    }
    return gif.user && hasHovered.current ? (
        <Container style={{ opacity: isHovered ? 1 : 0 }}>
            <Background />
            <Attribution gif={gif} onClick={onClick} />
        </Container>
    ) : null
}

export default AttributionOverlay
