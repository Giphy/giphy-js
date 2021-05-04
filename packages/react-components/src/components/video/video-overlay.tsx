import styled from '@emotion/styled'
import { Logger } from '@giphy/js-util'
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

export const VolumeOnIcon = ({ size = 38, onClick = () => {} }) => (
    <svg onClick={onClick} height={size} viewBox="0 0 115 115" width={size} xmlns="http://www.w3.org/2000/svg">
        <g fill="#FFF" fillRule="evenodd">
            <path d="M59.48 26.507v56.986c0 .68-.305 1.148-.914 1.405-.703.211-1.253.094-1.651-.351L40.824 66.88H29.51c-.422 0-.78-.146-1.072-.439A1.458 1.458 0 0 1 28 65.37V44.607c0-.422.146-.779.44-1.072.292-.292.65-.439 1.07-.439h11.314l16.09-17.643c.399-.445.95-.562 1.652-.351.609.257.913.726.913 1.405z" />
            <path
                d="M69.468 67.346l-2.837-6.4A6.501 6.501 0 0 0 70.5 55a6.501 6.501 0 0 0-3.855-5.94l2.854-6.392A13.5 13.5 0 0 1 77.5 55a13.5 13.5 0 0 1-8.032 12.346z"
                fillRule="nonzero"
            />
            <path
                d="M76.328 78.321l-2.838-6.4A18.503 18.503 0 0 0 84.5 55c0-7.373-4.351-13.95-10.968-16.903l2.853-6.392A25.502 25.502 0 0 1 91.5 55a25.502 25.502 0 0 1-15.172 23.321z"
                fillRule="nonzero"
            />
        </g>
    </svg>
)

export const VolumeOffIcon = ({ size = 38, onClick = () => {} }) => (
    <svg onClick={onClick} height={size} viewBox="0 0 115 115" width={size} xmlns="http://www.w3.org/2000/svg">
        <g fill="#FFF" fillRule="evenodd">
            <path d="M90.853 62.002a.637.637 0 0 1 0 .815l-4.036 4.036a.637.637 0 0 1-.815 0L79 59.851l-7.002 7.002a.637.637 0 0 1-.815 0l-4.036-4.036a.637.637 0 0 1 0-.815L74.149 55l-7.002-7.002a.637.637 0 0 1 0-.815l4.036-4.036a.637.637 0 0 1 .815 0L79 50.149l7.002-7.002a.637.637 0 0 1 .815 0l4.036 4.036a.637.637 0 0 1 0 .815L83.851 55l7.002 7.002zM59.48 26.507v56.986c0 .68-.305 1.148-.914 1.405-.703.211-1.253.094-1.651-.351L40.824 66.88H29.51c-.422 0-.78-.146-1.072-.439A1.458 1.458 0 0 1 28 65.37V44.607c0-.422.146-.779.44-1.072.292-.292.65-.439 1.07-.439h11.314l16.09-17.643c.399-.445.95-.562 1.652-.351.609.257.913.726.913 1.405z" />
        </g>
    </svg>
)

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
