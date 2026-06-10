import { useEffect, useRef, useState } from 'react'

/**
 * Returns value, updating at most once every ms.
 * The first change is applied immediately (leading edge); changes arriving while
 * throttled are applied when the window elapses (trailing edge).
 */
const useThrottle = <T>(value: T, ms: number = 200): T => {
    const [state, setState] = useState<T>(value)
    const timeout = useRef<ReturnType<typeof setTimeout>>()
    const nextValue = useRef<T | null>(null)
    const hasNextValue = useRef(false)

    useEffect(() => {
        if (!timeout.current) {
            setState(value)
            const timeoutCallback = () => {
                if (hasNextValue.current) {
                    hasNextValue.current = false
                    setState(nextValue.current as T)
                    timeout.current = setTimeout(timeoutCallback, ms)
                } else {
                    timeout.current = undefined
                }
            }
            timeout.current = setTimeout(timeoutCallback, ms)
        } else {
            nextValue.current = value
            hasNextValue.current = true
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value])

    useEffect(
        () => () => {
            if (timeout.current) {
                clearTimeout(timeout.current)
            }
        },
        []
    )

    return state
}

export default useThrottle
