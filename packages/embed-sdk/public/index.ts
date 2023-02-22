import GIPHY from '../src'

const clipUrl = 'https://giphy.com/clips/studiosoriginals-love-reaction-emotion-h48wFAB9JpSTSiXwHw'
const GIPHYVideo = new GIPHY.GIPHYVideo({
    url: clipUrl,
})
GIPHYVideo.loadPlayer('giphy-iframe')

// Buttons
const mute = document.getElementById('mute')
mute?.addEventListener('click', () => {
    GIPHYVideo.mute()
})

const unmute = document.getElementById('unmute')
unmute?.addEventListener('click', () => {
    GIPHYVideo.unmute()
})

const play = document.getElementById('play')
play?.addEventListener('click', () => {
    GIPHYVideo.play()
})

const pause = document.getElementById('pause')
pause?.addEventListener('click', () => {
    GIPHYVideo.pause()
})

const stop = document.getElementById('stop')
stop?.addEventListener('click', () => {
    GIPHYVideo.stop()
})

const seekTo = document.getElementById('seekTo')
const seekToValue = document.getElementById('seekToValue') as HTMLInputElement
seekTo?.addEventListener('click', () => {
    GIPHYVideo.seekTo(Number(seekToValue?.value))
})
