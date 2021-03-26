import styled from '@emotion/styled'
import React from 'react'
import Video from '.'
import { GifOverlayProps } from '../gif'

const VideoStyled = styled(Video)`
    height: 100%;
    display: inline-block;
    object-fit: cover;
`

const VideoOverlay = ({ gif, width, height, isHovered }: GifOverlayProps) => {
    return isHovered ? <VideoStyled gif={gif} key={gif.id} loop muted={false} width={width} height={height} /> : null
}
export default VideoOverlay
