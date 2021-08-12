import styled from '@emotion/styled'
import { getGifHeight } from '@giphy/js-util'
import React, { ComponentProps, useCallback, useEffect, useState } from 'react'
import Attribution from './attribution'
import { VolumeOffIcon, VolumeOnIcon } from './controls/volume'
import ProgressBar from './progress-bar'
import Video from './video'

type Props = {
    // turns on all controls
    controls?: boolean
    // if controls is true, hides progress bar
    hideProgressBar?: boolean
    // if controls is true, hides mute
    hideMute?: boolean
    // hide attribution
    hideAttribution?: boolean
    // don't hide controls when hovering away
    persistentControls?: boolean
    // for saving the state of the user muted
    onUserMuted?: (muted: boolean) => void
}

const Container = styled.div`
    position: relative;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: black;
    font-family: interface, helvetica, arial;
    -webkit-font-smoothing: antialiased;
`

const Volume = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`

const Controls = styled.div<{ isHovered: boolean }>`
    position: absolute;
    top: 10px;
    right: 10px;
    left: 10px;
    display: flex;
    justify-content: space-between;
    opacity: ${(props) => (props.isHovered ? 1 : 0)};
    transition: opacity ease-out 250ms;
    align-items: flex-start;
`

const Title = styled.div`
    font-size: 26px;
    color: white;
    margin-bottom: 5px;
    font-weight: bold;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
`
const TitleContainer = styled.div`
    min-width: 0;
`

const VideoPlayer = (props: ComponentProps<typeof VideoWrapper>) => {
    const { width, hideMute, hideAttribution, hideProgressBar, className, persistentControls, gif } = props
    const [isHovered, setIsHovered] = useState(false)
    const [videoEl, _setVideoEl] = useState<HTMLVideoElement | null>(null)
    const [muted, setMuted] = useState<boolean | undefined>(props.muted)
    const [mutedByBrowser, setMutedByBrowser] = useState(false)
    const { setVideoEl, onMuted, onUserMuted } = props
    const height = props.height || getGifHeight(gif, width)

    const combinedOnMuted = useCallback(
        (args) => {
            onMuted?.(args)
            setMutedByBrowser(args)
        },
        [setMutedByBrowser, onMuted]
    )
    const combinedSetVideoEl = useCallback(
        (args) => {
            setVideoEl?.(args)
            _setVideoEl(args)
        },
        [setVideoEl, _setVideoEl]
    )
    const toggleMute = () => {
        if (mutedByBrowser) {
            setMutedByBrowser(false)
            setMuted(false)
        } else {
            setMuted(!muted)
        }
    }
    useEffect(() => {
        setMuted(props.muted)
    }, [props.muted])
    return (
        <Container
            className={className}
            style={{ width, height }}
            onMouseOver={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={(e) => {
                onUserMuted?.(!muted)
                e.preventDefault()
                toggleMute()
            }}
        >
            <Video {...props} onMuted={combinedOnMuted} setVideoEl={combinedSetVideoEl} muted={muted} />
            <Controls isHovered={persistentControls || isHovered}>
                <TitleContainer>
                    {height >= 300 && <Title>{gif.title}</Title>}
                    {videoEl && !hideAttribution ? <Attribution gif={gif} /> : null}
                </TitleContainer>
                {!hideMute && <Volume>{muted || mutedByBrowser ? <VolumeOffIcon /> : <VolumeOnIcon />}</Volume>}
            </Controls>
            {(persistentControls || isHovered) && !hideProgressBar && videoEl ? (
                <ProgressBar videoEl={videoEl} />
            ) : null}
        </Container>
    )
}

const VideoWrapper = (props: ComponentProps<typeof Video> & Props) =>
    props.controls ? <VideoPlayer {...props} /> : <Video {...props} />

export default VideoWrapper
