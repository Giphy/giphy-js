type PlayOptions = {
    retryMuted?: boolean
    onMuted?: (muted: boolean) => void
}

type InvalidatePlayRequest = () => void
const pendingAutoplays = new WeakMap<HTMLVideoElement, InvalidatePlayRequest>()

export const invalidatePlayRequest = (video: HTMLVideoElement) => pendingAutoplays.get(video)?.()

const isNotAllowedError = (error: unknown) =>
    error !== null && typeof error === 'object' && 'name' in error && error.name === 'NotAllowedError'

const playWithoutRetry = async (video: HTMLVideoElement) => {
    try {
        await video.play()
    } catch {
        // Both synchronous failures and rejected promises end this attempt.
    }
}

// A pause must never turn a rejected play request into a new autoplay attempt.
export const playVideo = async (video: HTMLVideoElement, { retryMuted = false, onMuted }: PlayOptions = {}) => {
    // User-initiated play and looping must not discard pending autoplay policy handling.
    if (!retryMuted) return playWithoutRetry(video)

    invalidatePlayRequest(video)
    const source = video.src
    let invalidated = false
    const invalidateIfPaused = () => {
        // A queued pause from an older request can arrive after playback resumes.
        if (video.paused) invalidated = true
    }
    const invalidate = () => {
        invalidated = true
        video.removeEventListener('pause', invalidateIfPaused)
        video.removeEventListener('emptied', invalidate)
        if (pendingAutoplays.get(video) === invalidate) pendingAutoplays.delete(video)
    }
    pendingAutoplays.set(video, invalidate)
    video.addEventListener('pause', invalidateIfPaused)
    video.addEventListener('emptied', invalidate)
    const isCurrent = () => !invalidated && video.isConnected && video.src === source

    try {
        const promise = video.play()
        if (promise === undefined) return
        await promise
        if (isCurrent()) onMuted?.(false)
    } catch (error) {
        if (!isCurrent() || video.muted || !isNotAllowedError(error)) {
            return
        }
        video.muted = true
        // Start before notifying so a pause in the callback cancels this attempt.
        // The mute notification still fires if play() throws synchronously.
        const fallback = playWithoutRetry(video)
        onMuted?.(true)
        await fallback
    } finally {
        invalidate()
    }
}
