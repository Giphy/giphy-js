import styled from '@emotion/styled'
import { giphyWhite } from '@giphy/js-brand'
import React, { useLayoutEffect, useState } from 'react'
import { useRaf } from 'react-use'

const Bar = styled.div`
    background: ${giphyWhite};
    height: 2px;
    position: absolute;
    width: 5px;
    bottom: 0;
    left: 0;
    opacity: 0.95;
`
const ProgressBar = ({ videoEl }: { videoEl: HTMLVideoElement }) => {
    const [progress, setProgress] = useState(0)
    useRaf(2147483647, 100)
    const time = videoEl?.currentTime || 0
    const duration = videoEl?.duration || 0
    const val = time / duration
    useLayoutEffect(() => {
        setProgress(val)
    }, [val, setProgress])
    let perc = Math.round(progress * 100)
    perc = duration < 10 && perc > 98 ? 100 : perc
    return <Bar style={{ width: `${perc}%` }} />
}

export default ProgressBar
