# GIPHY oEmbed

To get your embed information you can simply call our oEmbed API:

```typescript
const clipUrl = 'https://giphy.com/clips/studiosoriginals-love-reaction-emotion-h48wFAB9JpSTSiXwHw'
const response = await fetch(`https://giphy.com/services/oembed?url=${clipUrl}`)
```

### Post Messaging

You can post message if is a content of **type video** using the following commands:
**play**

```typescript
iframe.contentWindow.postMessage(
    {
        action: 'play',
    },
    '*'
)
```

**pause**

```typescript
iframe.contentWindow.postMessage(
    {
        action: 'pause',
    },
    '*'
)
```

**stop**

```typescript
iframe.contentWindow.postMessage(
    {
        action: 'stop',
    },
    '*'
)
```

**mute**

```typescript
iframe.contentWindow.postMessage(
    {
        action: 'mute',
    },
    '*'
)
```

**unmute**

```typescript
iframe.contentWindow.postMessage(
    {
        action: 'mute',
    },
    '*'
)
```

**seekTo**

```typescript
iframe.contentWindow.postMessage(
    {
        action: 'seekTo',
        value: 10, // Time you want to go on the clip
    },
    '*'
)
```
