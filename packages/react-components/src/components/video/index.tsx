'use client'
import { getGifHeight, Logger } from '@giphy/js-util'
import React, { ComponentProps, CSSProperties, ElementType, useCallback, useEffect, useState } from 'react'
import useTimeoutFn from 'react-use/lib/useTimeoutFn'
import styled from 'styled-components'
import { GifOverlayProps } from '../types'
import Attribution from './attribution'
import { VolumeOffIcon, VolumeOnIcon } from './controls/volume'
import ProgressBar from './progress-bar'
import Video from './video'

type Props = {
    style?: CSSProperties
    // turns on all controls
    controls?: boolean
    // if controls is true, hides progress bar
    hideProgressBar?: boolean
    // if controls is true, hides the title
    hideTitle?: boolean
    // if controls is true, hides mute
    hideMute?: boolean
    // hide attribution
    hideAttribution?: boolean
    // don't hide controls when hovering away
    persistentControls?: boolean
    // for saving the state of the user muted
    onUserMuted?: (muted: boolean) => void
    // add a component that overlays the video
    // and can hide when hovered
    // TODO this should possibly be in video/video.tsx,
    // similar to how gif.tsx has the overlay
    // but we'd have to move the hover stuff into there
    overlay?: ElementType<GifOverlayProps>
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
    position: relative;
    cursor: pointer;
`

const Controls = styled.div<{ $isHovered: boolean }>`
    position: absolute;
    top: 10px;
    right: 10px;
    left: 10px;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    opacity: ${(props) => (props.$isHovered ? 1 : 0)};
    transition: opacity ease-out 250ms;
    align-items: flex-start;
`

const Title = styled.div`
    font-size: 22px;
    color: white;
    margin-bottom: 5px;
    font-weight: bold;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    user-select: none;
    cursor: pointer;
`
const TitleContainer = styled.div`
    position: relative;
    min-width: 0;
`

const Gradient = styled.div<{ $isLargePlayer: boolean }>`
    &:before {
        background: linear-gradient(rgba(18, 18, 18, 0.6), rgba(0, 0, 0, 0));
        content: '';
        height: ${(props) => (props.$isLargePlayer ? 125 : 75)}px;
        left: 0;
        pointer-events: none;
        position: absolute;
        top: 0;
        width: 100%;
    }
    &:after {
        background: linear-gradient(rgba(0, 0, 0, 0), rgba(18, 18, 18, 0.6));
        content: '';
        height: ${(props) => (props.$isLargePlayer ? 125 : 75)}px;
        left: 0;
        pointer-events: none;
        position: absolute;
        bottom: 0;
        width: 100%;
    }
`

const LARGE_PLAYER_HEIGHT = 300
const AUTO_HIDE_TIMEOUT = 4000
const VideoPlayer = (props: ComponentProps<typeof VideoWrapper>) => {
    const {
        style,
        width,
        percentWidth,
        hideMute,
        hideAttribution,
        hideProgressBar,
        hideTitle,
        className,
        persistentControls,
        gif,
        overlay: Overlay,
    } = props
    const [isHovered, setIsHovered] = useState(false)
    const [videoEl, _setVideoEl] = useState<HTMLVideoElement | null>(null)
    const [muted, setMuted] = useState<boolean | undefined>(props.muted)
    const [mutedByBrowser, setMutedByBrowser] = useState(false)
    const { setVideoEl, onMuted, onUserMuted } = props
    const height = props.height || getGifHeight(gif, width)
    let percentHeight: string | undefined
    if (percentWidth) {
        const ratio = Math.round((height / width) * 100)
        percentHeight = `${ratio}%`
    }
    const [, cancelHideTimeout, resetHideTimeout] = useTimeoutFn(() => {
        setIsHovered(false)
    }, AUTO_HIDE_TIMEOUT)

    const combinedOnMuted = useCallback(
        (args: boolean) => {
            onMuted?.(args)
            setMutedByBrowser(args)
        },
        [setMutedByBrowser, onMuted]
    )
    const combinedSetVideoEl = useCallback(
        (args: HTMLVideoElement) => {
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
    const showControls = persistentControls || isHovered
    const isLargePlayer = height >= LARGE_PLAYER_HEIGHT
    // Manage auto hide controls
    useEffect(() => {
        if (showControls) {
            resetHideTimeout()
        } else {
            cancelHideTimeout()
        }
        return () => cancelHideTimeout()
    }, [showControls, cancelHideTimeout, resetHideTimeout])
    return (
        <Container
            className={className}
            style={{ width: percentWidth || width, height: percentHeight || height, ...style }}
            onMouseOver={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onMouseMove={() => {
                setIsHovered(true)
                resetHideTimeout()
            }}
            onClick={(e) => {
                // TODO on mobile, maybe here we'd want to not mute if
                // controls are hidden, mute and show controls are the same action
                // which could be annoying
                onUserMuted?.(!(muted || mutedByBrowser))
                // adding this, it may save us if the browser blocks autoplay
                videoEl?.play()
                e.preventDefault()
                toggleMute()
            }}
        >
            <Video {...props} isInPlayer onMuted={combinedOnMuted} setVideoEl={combinedSetVideoEl} muted={muted} />
            {showControls && <Gradient $isLargePlayer={isLargePlayer} />}
            <Controls $isHovered={showControls}>
                <TitleContainer>
                    {!hideTitle && isLargePlayer && (
                        <Title
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                window.open(gif.url, '_blank')
                            }}
                        >
                            {gif.title}
                        </Title>
                    )}
                    {videoEl && !hideAttribution ? <Attribution gif={gif} /> : null}
                </TitleContainer>
                {!hideMute && <Volume>{muted || mutedByBrowser ? <VolumeOffIcon /> : <VolumeOnIcon />}</Volume>}
            </Controls>
            {showControls && !hideProgressBar && videoEl ? <ProgressBar videoEl={videoEl} /> : null}
            {Overlay && <Overlay gif={gif} isHovered={isHovered} width={width} height={height} />}
        </Container>
    )
}

const VideoWrapper = (props: ComponentProps<typeof Video> & Props) => {
    if (props.overlay && !props.controls) {
        console.warn(`${Logger.PREFIX}: Overlays only work when controls are enabled`)
    }
    return props.controls ? <VideoPlayer {...props} /> : <Video {...props} />
}

export default VideoWrapper
