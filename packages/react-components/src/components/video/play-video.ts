type PlayOptions = {
    retryMuted?: boolean
    onMuted?: (muted: boolean) => void
}

type CancelPlay = () => void
const pendingPlays = new WeakMap<HTMLVideoElement, CancelPlay>()

export const cancelVideoPlay = (video: HTMLVideoElement) => pendingPlays.get(video)?.()

// A pause must never turn a rejected play request into a new autoplay attempt.
export const playVideo = async (video: HTMLVideoElement, { retryMuted = false, onMuted }: PlayOptions = {}) => {
    cancelVideoPlay(video)
    const source = video.src
    let cancelled = false
    const onPause = () => {
        // A queued pause from an older request can arrive after playback resumes.
        if (video.paused) cancelled = true
    }
    const cancel = () => {
        cancelled = true
        video.removeEventListener('pause', onPause)
        video.removeEventListener('emptied', cancel)
        if (pendingPlays.get(video) === cancel) pendingPlays.delete(video)
    }
    pendingPlays.set(video, cancel)
    video.addEventListener('pause', onPause)
    video.addEventListener('emptied', cancel)
    const isCurrent = () => !cancelled && video.isConnected && video.src === source

    try {
        const promise = video.play()
        if (promise === undefined) return
        await promise
        if (isCurrent()) onMuted?.(false)
    } catch (error) {
        if (
            !isCurrent() ||
            !retryMuted ||
            video.muted ||
            !error ||
            typeof error !== 'object' ||
            !('name' in error) ||
            error.name !== 'NotAllowedError'
        ) {
            return
        }
        video.muted = true
        try {
            // Start before notifying so a pause in the callback cancels this attempt.
            const fallback = video.play()?.catch(() => undefined)
            onMuted?.(true)
            await fallback
        } catch {
            // A blocked or intentionally cancelled fallback must not retry again.
        }
    } finally {
        cancel()
    }
}
