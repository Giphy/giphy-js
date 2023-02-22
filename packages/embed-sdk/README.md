# @giphy/video-sdk

An SDK to help you embed GIPHY Clips on your website!

### Get started
```typescript
import GIPHYVideoSDK from '@giphy/video-sdk'
const clipUrl = 'https://giphy.com/clips/studiosoriginals-love-reaction-emotion-h48wFAB9JpSTSiXwHw'
const GIPHYVideo = new GIPHYVideoSDK({
    url: clipUrl,
})
GIPHYVideo.loadPlayer('giphy-iframe')

// Methods
// GIPHYVideo.play()
// GIPHYVideo.pause()
// GIPHYVideo.stop()
// GIPHYVideo.mute()
// GIPHYVideo.unmute()
// GIPHYVideo.seekTo(10)
```