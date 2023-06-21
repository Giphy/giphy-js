---
'@giphy/react-components': patch
'@giphy/js-analytics': patch
'@giphy/js-fetch-api': patch
'@giphy/js-brand': patch
'@giphy/js-util': patch
---

Remove "exports" from package.json as it breaks node when the project is type module. The packages need more refinements for compatibility in that scenario. Specifically adding .js extensions to the source code and a replacement for emotion
