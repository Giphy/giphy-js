import { useCallback, useEffect, useRef } from 'react'

export type UseTimeoutFnReturn = [isReady: () => boolean | null, clear: () => void, set: () => void]

/**
 * Calls fn after ms. The timeout starts on mount and restarts when ms changes.
 * Returns [isReady, clear, set]: isReady() is false while pending, true after firing
 * and null after clear(); set() (re)starts the timeout.
 */
export default function useTimeoutFn(fn: () => void, ms: number = 0): UseTimeoutFnReturn {
    const ready = useRef<boolean | null>(false)
    const timeout = useRef<ReturnType<typeof setTimeout>>()
    const callback = useRef(fn)

    const isReady = useCallback(() => ready.current, [])

    const set = useCallback(() => {
        ready.current = false
        if (timeout.current) {
            clearTimeout(timeout.current)
        }
        timeout.current = setTimeout(() => {
            ready.current = true
            callback.current()
        }, ms)
    }, [ms])

    const clear = useCallback(() => {
        ready.current = null
        if (timeout.current) {
            clearTimeout(timeout.current)
        }
    }, [])

    useEffect(() => {
        callback.current = fn
    }, [fn])

    useEffect(() => {
        set()
        return clear
    }, [ms, set, clear])

    return [isReady, clear, set]
}
