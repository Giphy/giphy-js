import { useEffect, useState } from 'react'

type WindowSize = {
    innerHeight: number
    innerWidth: number
    outerHeight: number
    outerWidth: number
}
const getSize = (): WindowSize => {
    lastSize = {
        innerHeight: window.innerHeight,
        innerWidth: window.innerWidth,
        outerHeight: window.outerHeight,
        outerWidth: window.outerWidth,
    }
    return lastSize
}

let lastSize: WindowSize

function useWindowSize(debounceMs = 300) {
    // this will run on every render, only getSize once
    const [windowSize, setWindowSize] = useState<WindowSize>(lastSize || getSize())
    useEffect(
        () => {
            let timeoutId: any
            const onResize = () => {
                clearTimeout(timeoutId)
                timeoutId = setTimeout(() => setWindowSize(getSize()), debounceMs)
            }
            window.addEventListener('resize', onResize)
            return () => {
                clearTimeout(timeoutId)
                window.removeEventListener('resize', onResize)
            }
        },
        // not likely to change debounce, but reset timeouts if it changes
        [debounceMs]
    )
    return windowSize
}

export default useWindowSize
