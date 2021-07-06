import React, { ComponentProps } from 'react'
import VideoPlayer from './player'
import Video from './video'

type Props = {
    controls?: boolean
    // for saving the state of the user muted
    onUserMuted?: (muted: boolean) => void
}
const VideoWrapper = (props: ComponentProps<typeof Video> & Props) =>
    props.controls ? <VideoPlayer {...props} /> : <Video {...props} />

export default VideoWrapper
