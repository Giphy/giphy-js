import { useEffect, useLayoutEffect, useState } from 'react'

// useLayoutEffect warns when rendering on the server, fall back to useEffect there
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

/**
 * Re-renders the component on every animation frame for ms milliseconds, starting after delay.
 * Returns elapsed time as a fraction from 0 to 1.
 */
const useRaf = (ms: number = 1e12, delay: number = 0): number => {
    const [elapsed, setElapsed] = useState(0)

    useIsomorphicLayoutEffect(() => {
        let raf: number
        let timerStop: ReturnType<typeof setTimeout>
        let start: number

        const onFrame = () => {
            setElapsed(Math.min(1, (Date.now() - start) / ms))
            raf = requestAnimationFrame(onFrame)
        }
        const onStart = () => {
            timerStop = setTimeout(() => {
                cancelAnimationFrame(raf)
                setElapsed(1)
            }, ms)
            start = Date.now()
            raf = requestAnimationFrame(onFrame)
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

export default useRaf
