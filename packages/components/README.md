# @giphy/js-components

A lightweight set of components, focused on ease-of-use and performance.

## Try it out:

[![Edit @giphy/js-components](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/1wq52x1w44?fontsize=14)

## Grid

Use `renderGrid(props, target)` to render a grid to a target element

### Bare Bones Example

```javascript
import { renderGrid } from '@giphy/js-components'
import { GiphyFetch } from '@giphy/js-fetch-api'

// create a GIPHY API client with your api key
const gf = new GiphyFetch('your api key')
// fetch 10 gifs at a time from the GIPHY Trending API as the user scrolls
// create a fetch gifs function that takes an `offset` parameter
const fetchGifs = (offset) => gf.trending({ offset, limit: 10 })
// render a grid
const targetEl = window.document.getElementById('giphy-grid')
renderGrid({ width: 800, columns: 3, gutter: 6, fetchGifs }, targetEl)
```

<!-- The grid uses [bricks.js]() to render a grid with fixed width items. -->

_renderGrid options_

| _prop_                    | _type_                                   | _default_             | _description_                                                            |
| ------------------------- | ---------------------------------------- | --------------------- | ------------------------------------------------------------------------ |
| width                     | `number`                                 | document width or 800 | The width of the grid                                                    |
| fetchGifs                 | `(offset:number) => Promise<GifsResult>` | undefined             | A function that returns a Promise<GifsResult>. Use `@giphy/js-fetch-api` |
| columns                   | `number`                                 | 3                     | The number of columns in the grid                                        |
| gutter                    | `number`                                 | 6                     | The space between columns and rows                                       |
| targetEl                  |  `HTMLElement`                           | undefined             | Target element into which the grid is rendered                           |
| [Gif Events](#gif-events) | \*                                       | \*                    | see below                                                                |

### Thorough Example

```javascript
import { throttle } from 'throttle-debounce'
import { renderGrid } from '@giphy/js-components'
import { GiphyFetch } from '@giphy/js-fetch-api'

// create a GIPHY API client with your api key
const gf = new GiphyFetch('your api key')

// create a fetch gifs function that takes an `offset` parameter
// this will allow the grid to paginate as the user scrolls
const fetchGifs = (offset) => {
    // use whatever end point you want,
    // but be sure to pass offset to paginate correctly
    return gf.trending({ offset, limit: 25 })
}

// Creating a grid with window resizing and remove-ability
const makeGrid = (targetEl) => {
    const render = () => {
        // here is the @giphy/js-components import
        return renderGrid(
            {
                width: innerWidth,
                columns: window.innerWidth < 500 ? 2 : 3,
                gutter: 6,
                fetchGifs,
            },
            targetEl
        )
    }
    // register callback to window resize event
    const resizeRender = throttle(500, render)
    window.addEventListener('resize', resizeRender, false)
    // render the grid
    const el = render()
    // return a removal function
    return () => {
        el.parentNode.removeChild(el)
        window.removeEventListener('resize', resizeRender, false)
    }
}

// Instantiate
const removeGrid = makeGrid(window.document.getElementById('giphy-grid'))

// To remove
removeGrid()
```

## Carousel

_renderCarousel options_

| property                  | type                                     | default   | description                                                              |
| ------------------------- | ---------------------------------------- | --------- | ------------------------------------------------------------------------ |
| gifHeight                 | `number`                                 | undefined | The height of the gifs and the carousel                                  |
| fetchGifs                 | `(offset:number) => Promise<GifsResult>` | undefined | A function that returns a Promise<GifsResult>. Use `@giphy/js-fetch-api` |
| gutter                    | `number`                                 | 6         | The space between columns and rows                                       |
| [Gif Events](#gif-events) | \*                                       | \*        | see below                                                                |

```typescript
import { renderCarousel } from '@giphy/js-components'
import { GiphyFetch } from '@giphy/js-fetch-api'

// create a GIPHY API client with your api key
const gf = new GiphyFetch('your api key')

// fetch 10 gifs at a time from the GIPHY Trending API as the user scrolls
// create a fetch gifs function that takes an `offset` parameter
const fetchGifs = (offset) => gf.trending({ offset, limit: 10 })

renderCarousel(
    {
        gifHeight: 200,
        gutter: 6,
        onGifClick: (gif) => window.open(gif.url),
        fetchGifs
    },
    window.document.getElementById('giphy-carousel')
)
```

### Gif Events

| property        | type                                                                 | description                                                     |
| --------------- | -------------------------------------------------------------------- | --------------------------------------------------------------- |
| onGifHover      | `(gif: IGif, e: Event) => void`                                      | fired on desktop when hovered for                               |
| onGifVisible    | `(gif: IGif, e: Event) => void`                                      | fired every time the gif is show                                |
| onGifSeen       | `(gif: IGif, boundingClientRect: ClientRect &#124; DOMRect) => void` | fired once after the gif loads and when it's completely in view |
| onGifClick      | `(gif: IGif, e: Event) => void`                                      | fired when the gif is clicked                                   |
| onGifRightClick | `(gif: IGif, e: Event) => void`                                      | fired when the gif is right clicked                             |
