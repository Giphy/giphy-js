---
'@giphy/react-components': patch
---

Treat cancelled video play requests as cancellation instead of retrying muted playback. Retry autoplay only for browser policy rejection, ignore stale requests, and catch failed fallback, loop, and controls playback promises.
