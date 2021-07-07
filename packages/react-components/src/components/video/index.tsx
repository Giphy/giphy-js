import React, { ComponentProps } from 'react'
import VideoPlayer from './player'
import Video from './video'

type Props = {
    // turns on all controls
    controls?: boolean
    // if controls is true, hides progress bar
    hideProgressBar?: boolean
    // if controls is true, hides mute
    hideMute?: boolean
    // if controls is true, hides play/pause
    hidePlayPause?: boolean
    // don't hide controls when hovering away
    persistentControls?: boolean
    // for saving the state of the user muted
    onUserMuted?: (muted: boolean) => void
}
const VideoWrapper = (props: ComponentProps<typeof Video> & Props) =>
    props.controls ? <VideoPlayer {...props} /> : <Video {...props} />

export default VideoWrapper
