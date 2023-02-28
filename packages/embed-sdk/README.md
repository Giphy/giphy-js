# @giphy/video-sdk

An SDK to help you embed GIPHY Clips on your website!

### Installation

##### Option 1

Install using a package manager `yarn add @giphy/embed-sdk`or `npm install @giphy/embed-sdk`

##### Option 2

Import using the browser SDK `<script src="https://unpkg.com/@giphy/embed-sdk@1.0.1/dist/umd/index.js"></script>`

##### Option 3

Make your own implementation following our [oEmbed docs](OEMBED.md).

### Usage

```typescript
const clipUrl = 'https://giphy.com/clips/studiosoriginals-love-reaction-emotion-h48wFAB9JpSTSiXwHw'
const Video = new GiphyEmbed.GiphyVideo({
    url: clipUrl,
})

const elementId = 'giphy-iframe'
Video.loadPlayer(elementId)
```

### Methods

#### Note: The clip automatically mutes after 3 loops.

```typescript
Video.play() // Play the clip
```

```typescript
Video.pause() // Pause the clip
```

```typescript
Video.stop() // Stop the clip
```

```typescript
Video.mute() // Mute the clip
```

```typescript
Video.unmute() // Unmute the clip
```

```typescript
Video.seekTo(10) // Goes to a direct time on the clip
```
