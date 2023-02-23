# @giphy/video-sdk

An SDK to help you embed GIPHY Clips on your website!

### Get started
```typescript
import { GiphyVideo } from '@giphy/video-sdk'
const clipUrl = 'https://giphy.com/clips/studiosoriginals-love-reaction-emotion-h48wFAB9JpSTSiXwHw'
const Video = new GiphyVideo({
    url: clipUrl,
})
Video.loadPlayer('giphy-iframe')

// Methods
// Video.play()
// Video.pause()
// Video.stop()
// Video.mute()
// Video.unmute()
// Video.seekTo(10)
```