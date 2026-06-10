import { DependencyList, useEffect } from 'react'
import useTimeoutFn from './use-timeout-fn'

export type UseDebounceReturn = [isReady: () => boolean | null, cancel: () => void]

/**
 * Calls fn ms after the last change to deps; earlier pending calls are dropped.
 * Returns [isReady, cancel].
 */
export default function useDebounce(fn: () => void, ms: number = 0, deps: DependencyList = []): UseDebounceReturn {
    const [isReady, cancel, reset] = useTimeoutFn(fn, ms)

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(reset, deps)

    return [isReady, cancel]
}
