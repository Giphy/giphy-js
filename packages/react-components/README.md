# @giphy/react-components

React components, focused on ease-of-use and performance.

## Try it out:

[![Edit @giphy/react-components](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/giphyreact-components-hbmcf?from-embed)

## Grid

### Bare Bones Example

```typescript
import { Grid } from '@giphy/react-components'
import { GiphyFetch } from '@giphy/js-fetch-api'

// use @giphy/js-fetch-api to fetch gifs
const gf = new GiphyFetch('your api key')
// create a fetch gifs function that takes an `offset` parameter
// this will allow the grid to paginate as the user scrolls
const fetchGifs = (offset: number) => gf.trending({ offset, limit: 10 })
// React Component
<Grid width={800} columns={3} gutter={6} fetchGifs={fetchGifs} />
```

<!-- The grid uses [bricks.js]() to render a grid with fixed width items. -->

| _prop_                                | _type_                                   | _default_             | _description_                                                            |
| ------------------------------------- | ---------------------------------------- | --------------------- | ------------------------------------------------------------------------ |
| width                                 | `number`                                 | document width or 800 | The width of the grid                                                    |
| columns                               | `number`                                 | 3                     | The number of columns in the grid                                        |
| gutter                                | `number`                                 | 6                     | The space between columns and rows                                       |
| fetchGifs                             | `(offset:number) => Promise<GifsResult>` | undefined             | A function that returns a Promise<GifsResult>. Use `@giphy/js-fetch-api` |
| [Gif Events](#gif-events)             | \*                                       | \*                    | see below                                                                |
| [API Fetch Events](#api-fetch-events) | \*                                       | \*                    | see below                                                                |

## Carousel

| _prop_                                | _type_                                   | _default_ | _description_                                                            |
| ------------------------------------- | ---------------------------------------- | --------- | ------------------------------------------------------------------------ |
| gifHeight                             | `number`                                 | undefined | The height of the gifs and the carousel                                  |
| gutter                                | `number`                                 | 6         | The space between columns and rows                                       |
| fetchGifs                             | `(offset:number) => Promise<GifsResult>` | undefined | A function that returns a Promise<GifsResult>. Use `@giphy/js-fetch-api` |
| [Gif Events](#gif-events)             | \*                                       | \*        | see below                                                                |
| [API Fetch Events](#api-fetch-events) | \*                                       | \*        | see below                                                                |

```typescript
import { Carousel } from '@giphy/react-components'
import { GiphyFetch } from '@giphy/js-fetch-api'

// use @giphy/js-fetch-api to fetch gifs
const gf = new GiphyFetch('your api key')

// create a fetch gifs function that takes an `offset` parameter
// this will allow the grid to paginate as the user scrolls
const fetchGifs = (offset: number) => gf.trending({ offset, limit: 10 })

// React Component
<Carousel gifHeight={200} gutter={6} fetchGifs={fetchGifs} />
```

## Gif

_Gif props_

| _prop_                    | _type_   | _default_          | _description_                             |
| ------------------------- | -------- | ------------------ | ----------------------------------------- |
| gif                       | `IGif`   | undefined          | The gif to display                        |
| width                     | `number` | undefined          | The width of the gif                      |
| backgroundColor           | `string` | random giphy color | The background of the gif before it loads |
| [Gif Events](#gif-events) | \*       | \*                 | see below                                 |

```typescript
import { Gif } from '@giphy/react-components'
import { GiphyFetch } from '@giphy/js-fetch-api'

// use @giphy/js-fetch-api to fetch gifs
const gf = new GiphyFetch('your api key')
// fetch a GIF from the GIPHY API
const { data } = await gf.gif('fpXxIjftmkk9y')
// React Component
<Gif gif={data} width={300} />
```

### Gif Events

| _prop_          | _type_                                                               | _description_                                                   |
| --------------- | -------------------------------------------------------------------- | --------------------------------------------------------------- |
| onGifHover      | `(gif: IGif, e: SyntheticEvent<HTMLElement, Event>) => void`         | fired on desktop when hovered over                              |
| onGifUnhover    | `(gif: IGif, e: SyntheticEvent<HTMLElement, Event>) => void`         | fired on desktop on mouse out, given an active hover event      |
| onGifVisible    | `(gif: IGif, e: SyntheticEvent<HTMLElement, Event>) => void`         | fired every time the gif is shown                               |
| onGifSeen       | `(gif: IGif, boundingClientRect: ClientRect | DOMRect) => void`      | fired once after the gif loads and when it's completely in view |
| onGifClick      | `(gif: IGif, e: SyntheticEvent<HTMLElement, Event>) => void`         | fired when the gif is clicked                                   |
| onGifRightClick | `(gif: IGif, e: SyntheticEvent<HTMLElement, Event>) => void`         | fired when the gif is right clicked                             |

### API Fetch Events

| property        | type                                                                 | description                                                     |
| --------------- | -------------------------------------------------------------------- | --------------------------------------------------------------- |
| onFetch         | `(gifs: IGif[]) => void`                                             | fired by paginator on each fetch, provides list of gifs fetched |
| onPage          | `(page: number) => void`                                             | fired by paginator on each fetch, provides page number          |
| onGifsFetched   | `(gifs: IGif[]) => void`                                             | fired by component on each fetch, provides list of all gifs     |
| onFetchError    | `(e: Error) => void`                                                 | fired by component on fetch error                               |
