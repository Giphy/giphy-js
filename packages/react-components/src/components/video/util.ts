export type QuartileEvent = 0.25 | 0.5 | 0.75

export const getErrorMessage = (code: number, src = '') => {
    switch (code) {
        case 1:
            return "Aborted. The fetching process for the media resource was aborted by the user agent at the user's request."
        case 2:
            return 'Network Error. A network error of some description caused the user agent to stop fetching the media resource, after the resource was established to be usable.'
        case 3:
            return 'Decode Error. An error of some description occurred while decoding the media resource, after the resource was established to be usable.'
        case 4:
            return `Can not play a video of type "${src.split('.').pop()}" on this platform.`
        default:
            return ''
    }
}

export const shouldFireQuartile = (
    quartile: QuartileEvent,
    playhead: number,
    duration: number,
    quartilesFired: Set<number>,
    loopNumber: number
): boolean => {
    const currentQuartile = loopNumber + quartile
    // NOTE: Should only fire on first loop, if looping.
    if (!quartilesFired.has(currentQuartile) && duration > 0 && playhead > duration * quartile) {
        quartilesFired.add(currentQuartile)
        return true
    }
    return false
}
