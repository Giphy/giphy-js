import { css } from 'emotion'
import { giphyWhite } from '@giphy/js-brand'
import { useState, useLayoutEffect } from 'preact/hooks'
import { h } from 'preact'

const useRaf = (ms: number = 1e12, delay: number = 0): number => {
    const [elapsed, set] = useState<number>(0)

    useLayoutEffect(() => {
        let raf: number
        let timerStop: NodeJS.Timeout
        let start: number

        const onFrame = () => {
            const time = Math.min(1, (Date.now() - start) / ms)
            set(time)
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            loop()
        }
        const loop = () => {
            raf = requestAnimationFrame(onFrame)
        }
        const onStart = () => {
            timerStop = setTimeout(() => {
                cancelAnimationFrame(raf)
                set(1)
            }, ms)
            start = Date.now()
            loop()
        }
        const timerDelay = setTimeout(onStart, delay)

        return () => {
            clearTimeout(timerStop)
            clearTimeout(timerDelay)
            cancelAnimationFrame(raf)
        }
    }, [ms, delay])

    return elapsed
}

const barCss = css`
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
    return <div style={{ width: `${perc}%` }} className={barCss} />
}

export default ProgressBar
