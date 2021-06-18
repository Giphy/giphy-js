import styled from '@emotion/styled'
import { Logger } from '@giphy/js-util'
import React, { useState } from 'react'
import Video from '.'
import { GifOverlayProps } from '../gif'
import { VolumeOffIcon, VolumeOnIcon } from './controls/volume'

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
    object-fit: fill;
`
const Button = styled.div`
    position: absolute;
    top: 5px;
    right: 10px;
`

const DebugButton = styled.div`
    background: black;
    color: white;
    padding: 10px;
    position: absolute;
    top: 0;
    left: 0;
`

type UIProps = {
    toggleMute: () => void
    muted: boolean | undefined
    mutedByBrowser: boolean
}

const DebugUI = ({ toggleMute, muted, mutedByBrowser }: UIProps) => (
    <DebugButton>
        <div
            onClick={(e) => {
                e.preventDefault()
                toggleMute()
            }}
        >
            click box to {muted ? 'unmute' : 'mute'}
            <br />
            {muted ? 'user muted' : 'user not muted'}
            <br />
            {mutedByBrowser ? 'muted by browser' : 'not muted by browser'}
        </div>
    </DebugButton>
)

const VolumeButton = ({ muted, toggleMute, mutedByBrowser, isHovered }: UIProps & { isHovered: boolean }) => (
    <Button
        onClick={(e) => {
            e.preventDefault()
            toggleMute()
        }}
    >
        {muted || mutedByBrowser || !isHovered ? <VolumeOffIcon /> : <VolumeOnIcon />}
    </Button>
)

const VideoOverlay = ({ gif, isHovered, width }: GifOverlayProps & { width: number }) => {
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
    const props = { toggleMute, muted, mutedByBrowser }
    return (
        <VideoContainer>
            {isHovered && (
                <VideoStyled gif={gif} key={gif.id} loop muted={muted} width={width} onMuted={setMutedByBrowser} />
            )}
            {Logger.ENABLED ? <DebugUI {...props} /> : <VolumeButton {...props} isHovered={isHovered} />}
        </VideoContainer>
    )
}
export default VideoOverlay
