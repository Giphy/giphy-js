---
'@giphy/react-components': major
---

Responsive grid:

Rewrite grid logic to support a `percentageWidth`, allowing the grid to be rendereded on the server.
The `width` property still determines the rendition selection of the grid items, but the grid will scale to the percentage value provided (e.g. `100%`)

Remove `useTransform` property:

This was used to layout grid items and has been replaced by a new strategy

Loader height:

The loader style was using a padding to allow for its height, this was a bad approach as padding is not applied in flex containers.
