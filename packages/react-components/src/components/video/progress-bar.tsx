import styled from '@emotion/styled'
import { giphyWhite } from '@giphy/js-brand'
import React from 'react'
import useRaf from 'react-use/lib/useRaf'

const Bar = styled.div<{ barHeight: number }>`
    background: ${giphyWhite};
    height: ${(props) => props.barHeight}px;
    position: absolute;
    width: 5px;
    bottom: 0;
    left: 0;
    opacity: 0.95;
`
const ProgressBar = ({ videoEl }: { videoEl: HTMLVideoElement }) => {
    useRaf(2147483647, 100)
    const time = videoEl?.currentTime || 0
    const duration = videoEl?.duration || 0
    const val = time / duration
    let percentage = Math.round(val * 100)
    let barHeight = 5
    if (videoEl?.height < 200) {
        barHeight = 3
    } else if (videoEl?.height < 300) {
        barHeight = 4
    }
    percentage = duration < 10 && percentage > 98 ? 100 : percentage
    return <Bar style={{ width: `${percentage}%` }} barHeight={barHeight} className="hide-in-percy" />
}

export default ProgressBar
