---
'@giphy/react-components': major
---

Responsive `Grid`:

Rewrite grid logic to support a `percentageWidth`, allowing the grid to be rendereded on the server.
The `width` property still determines the rendition selection of the grid items, but the grid will scale to the percentage value provided (e.g. `100%`)

Remove `useTransform` property:

This was used to layout grid items and has been replaced by a new strategy


`Gif`:

Add `lazyLoad` property to Gif component, default true. If set to false, on screen logic won't be run and the img will always show. Should be used in SSR.


`Loader` height:

The loader style was using a padding to allow for its height, this was a bad approach as padding is not applied in flex containers.
