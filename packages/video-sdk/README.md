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
```

##### Search Options:

| method | type   | description                                     | default |
| :----- | :----- | :---------------------------------------------- | :-----: |
| _lang_ | string | See list of supported languages [here][lang].   |   en    |
| _sort_ | number | Specifies the starting position of the results. | recent  |

> Other Options: [Type Option](#type-option), [Rating Option](#rating-option), [Pagination Options](#pagination-options)

##### Example:

```typescript
GIPHYVideo.mute()
```
