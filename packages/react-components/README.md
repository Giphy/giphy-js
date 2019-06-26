# @giphy/react-components

React components, focused on ease-of-use and performance.

<!-- ## Try it out: -->

<!-- [![Edit @giphy/react-components](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/1wq52x1w44?fontsize=14) -->

## Grid

### Bare Bones Example

```typescript
import { Grid } from '@giphy/react-components'
import { GiphyFetch } from '@giphy/js-fetch-api'
// use @giphy/js-fetch-api to fetch gifs
const gf = new GiphyFetch('your api key')
// fetch 10 gifs at a time as the user scrolls (offset is handled by the grid)
const fetchGifs = (offset: number) => gf.trending({ offset, limit: 10 })
// React Component
<Grid width={width} columns={3} gutter={6} fetchGifs={fetchGifs} />
```

<!-- The grid uses [bricks.js]() to render a grid with fixed width items. -->

_renderGrid options_

| _prop_                    | _type_                                   | _default_ | _description_                                                            |
| ------------------------- | ---------------------------------------- | --------- | ------------------------------------------------------------------------ |
| width                     | `number`                                 | undefined | The width of the grid                                                    |
| fetchGifs                 | `(offset:number) => Promise<GifsResult>` | undefined | A function that returns a Promise<GifsResult>. Use `@giphy/js-fetch-api` |
| columns                   | `number`                                 | 3         | The number of columns in the grid                                        |
| gutter                    | `number`                                 | 6         | The space between columns and rows                                       |
| [Gif Events](#gif-events) | \*                                       | \*        | see below                                                                |

## Carousel

_renderCarousel options_

| property                  | type                                     | default   | description                                                              |
| ------------------------- | ---------------------------------------- | --------- | ------------------------------------------------------------------------ |
| gifHeight                 | `number`                                 | undefined | The height of the gifs and the carousel                                  |
| fetchGifs                 | `(offset:number) => Promise<GifsResult>` | undefined | A function that returns a Promise<GifsResult>. Use `@giphy/js-fetch-api` |
| gutter                    | `number`                                 | 6         | The space between columns and rows                                       |
| [Gif Events](#gif-events) | \*                                       | \*        | see below                                                                |

```typescript
import { Carousel } from '@giphy/react-components'
import { GiphyFetch } from '@giphy/js-fetch-api'

// use @giphy/js-fetch-api to fetch gifs
const gf = new GiphyFetch('your api key')
// fetch 10 gifs at a time as the user scrolls (offset is handled by the grid)
const fetchGifs = (offset: number) => gf.trending({ offset, limit: 10 })

// React Component
<Carousel gifHeight={200} user={{}} gutter={6} fetchGifs={fetchGifs} />
```

### Gif Events

| property        | type                                                                 | description                                                     |
| --------------- | -------------------------------------------------------------------- | --------------------------------------------------------------- |
| onGifHover      | `(gif: IGif, e: SyntheticEvent<HTMLElement, Event>) => void`         | fired on desktop when hovered for                               |
| onGifVisible    | `(gif: IGif, e: SyntheticEvent<HTMLElement, Event>) => void`         | fired every time the gif is show                                |
| onGifSeen       | `(gif: IGif, boundingClientRect: ClientRect &#124; DOMRect) => void` | fired once after the gif loads and when it's completely in view |
| onGifClick      | `(gif: IGif, e: SyntheticEvent<HTMLElement, Event>) => void`         | fired when the gif is clicked                                   |
| onGifRightClick | `(gif: IGif, e: SyntheticEvent<HTMLElement, Event>) => void`         | fired when the gif is right clicked                             |
