---
'@giphy/svelte-components': minor
'@giphy/js-analytics': major
'@giphy/js-fetch-api': major
'@giphy/js-brand': major
'@giphy/js-util': major
'@giphy/react-components': patch
---

util, analytics, fetch-api and brand are all type: module now. See [here](https://github.com/Giphy/giphy-js/pull/391#issue-1770394467) for more info

## Possible breaking change

The output format has changed. If you are accessing files in dist, your build will fail.
