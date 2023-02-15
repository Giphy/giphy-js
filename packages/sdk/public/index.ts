import GIPHY from "../src"

const clipUrl = 'https://giphy.com/clips/studiosoriginals-love-reaction-emotion-h48wFAB9JpSTSiXwHw'
const GIPHYVideo = new GIPHY.GIPHYVideo(clipUrl)
GIPHYVideo.loadPlayer('giphy-iframe')

// Buttons
const mute = document.getElementById('mute')
mute?.addEventListener('click', () => {
    console.log("MUTE")
    GIPHYVideo.mute()
})

const unmute = document.getElementById('unmute')
unmute?.addEventListener('click', () => {
    console.log("UNMUTE")
    GIPHYVideo.unmute()
})