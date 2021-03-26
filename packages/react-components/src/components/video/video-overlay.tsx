import styled from '@emotion/styled'
import React, { useState } from 'react'
import Video from '.'
import { GifOverlayProps } from '../gif'

const VideoContainer = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    height: 100%;
    width: 100%;
`
const VideoStyled = styled(Video)`
    height: 100%;
    display: inline-block;
    object-fit: cover;
`

const Button = styled.div`
    background: black;
    color: white;
    padding: 10px;
`

const VideoOverlay = ({ gif, width, height, isHovered }: GifOverlayProps) => {
    const [muted, setMuted] = useState<boolean | undefined>(undefined)
    const [mutedByBrowser, setMutedByBrowser] = useState(false)
    const toggleMute = () => {
        if (mutedByBrowser) {
            setMutedByBrowser(false)
            setMuted(false)
        } else {
            setMuted(!muted)
        }
    }
    return (
        <VideoContainer>
            <Button
                onClick={(e) => {
                    e.preventDefault()
                    toggleMute()
                }}
            >
                {muted ? 'user muted' : 'user not muted'}
                <br />
                {mutedByBrowser ? 'muted by browser' : 'not muted by browser'}
            </Button>
            {isHovered ? (
                <VideoStyled
                    gif={gif}
                    key={gif.id}
                    loop
                    muted={muted}
                    width={width}
                    height={height}
                    onMuted={setMutedByBrowser}
                />
            ) : null}
        </VideoContainer>
    )
}
export default VideoOverlay
