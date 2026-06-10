import { MutableRefObject, useRef } from 'react'

/**
 * Returns a ref that always holds the latest value.
 * Useful for reading fresh props/state inside async callbacks without re-triggering effects.
 */
const useLatest = <T>(value: T): MutableRefObject<T> => {
    const ref = useRef<T>(value)
    ref.current = value
    return ref
}

export default useLatest
