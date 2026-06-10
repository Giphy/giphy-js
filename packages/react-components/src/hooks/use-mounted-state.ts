import { useCallback, useEffect, useRef } from 'react'

/**
 * Returns a function that reports whether the component is still mounted,
 * so async callbacks can avoid setting state after unmount.
 */
export default function useMountedState(): () => boolean {
    const mountedRef = useRef<boolean>(false)
    const get = useCallback(() => mountedRef.current, [])

    useEffect(() => {
        mountedRef.current = true
        return () => {
            mountedRef.current = false
        }
    }, [])

    return get
}
