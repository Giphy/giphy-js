import { DependencyList, useCallback, useRef, useState } from 'react'
import useMountedState from './use-mounted-state'

export type AsyncState<T> = {
    loading: boolean
    error?: Error
    value?: T
}

export type AsyncFn<Args extends unknown[], T> = (...args: Args) => Promise<T>

/**
 * Wraps an async function: returns its [state, trigger] where state tracks loading / value / error.
 * Stale resolutions are ignored (only the latest call updates state) and state is never set after unmount.
 */
export default function useAsyncFn<Args extends unknown[], T>(
    fn: AsyncFn<Args, T>,
    deps: DependencyList = [],
    initialState: AsyncState<T> = { loading: false }
): [AsyncState<T>, AsyncFn<Args, T>] {
    const lastCallId = useRef(0)
    const isMounted = useMountedState()
    const [state, set] = useState<AsyncState<T>>(initialState)

    const callback = useCallback((...args: Args) => {
        const callId = ++lastCallId.current

        if (!state.loading) {
            set((prevState) => ({ ...prevState, loading: true }))
        }

        return fn(...args).then(
            (value) => {
                if (isMounted() && callId === lastCallId.current) {
                    set({ value, loading: false })
                }
                return value
            },
            (error) => {
                if (isMounted() && callId === lastCallId.current) {
                    set({ error, loading: false })
                }
                return error
            }
        )
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps)

    return [state, callback]
}
