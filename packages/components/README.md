# @giphy/js-components

A lightweight set of components, focused on easy-of-use and performance.

## Grid

Use `renderGrid(props, target)` to render a grid to a target element

### Bare Bones Example

```typescript
// use @giphy/js-fetch-api to fetch gifs
const gf = new GiphyFetch('your api key')
// fetch 10 gifs at a time as the user scrolls (offset is handled by the grid)
const fetchGifs = (offset: number) => gf.trending({ offset, limit: 10 })
// render a grid
renderGrid({ width: 800, fetchGifs }, targetEl)
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

### Thorough Example

```typescript
import { throttle } from 'throttle-debounce'
import { renderGrid } from '@giphy/js-components'
import { GiphyFetch } from '@giphy/js-fetch-api'

// create a GiphyFetch with your api key
const gf = new GiphyFetch('your api key')
// create a fetch gifs function that takes an offset
// this will allow the grid to paginate as the user scrolls
const fetchGifs = (offset: number) => {
    // use whatever end point you want,
    // but be sure to pass offset to paginate correctly
    return gf.trending({ offset, limit: 25 })
}

// Creating a grid with window resizing and remove-ability
const makeGrid = (targetEl: HTMLElement) => {
    const render = () => {
        // here is the @giphy/js-components import
        return renderGrid(
            {
                width: innerWidth,
                fetchGifs,
                columns: width < 500 ? 2 : 3,
                gutter: 6,
            },
            targetEl
        )
    }
    const resizeRender = throttle(500, render)
    window.addEventListener('resize', resizeRender, false)
    const el = render()
    return () => {
        el.parentNode.removeChild(el)
        window.removeEventListener('resize', resizeRender, false)
    }
}

// Instantiate
const grid = makeGrid(document.querySelector('.grid'))

// To remove
grid.remove()
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
import { renderGrid, Grid } from '@giphy/js-components'

// Creating a grid with window resizing and remove-ability
export const vanillaJSCarousel = (mountNode: HTMLElement) => {
    const onGifClick = (gif: IGif) => {
        window.open(gif.url)
    }
    renderCarousel(
        {
            gifHeight: 200,
            onGifClick,
            fetchGifs,
            gutter: 6,
        },
        mountNode
    )
}
```

### Gif Events

| property        | type                                                                 | description                                                     |
| --------------- | -------------------------------------------------------------------- | --------------------------------------------------------------- |
| onGifHover      | `(gif: IGif, e: Event) => void`                                      | fired on desktop when hovered for                               |
| onGifVisible    | `(gif: IGif, e: Event) => void`                                      | fired every time the gif is show                                |
| onGifSeen       | `(gif: IGif, boundingClientRect: ClientRect &#124; DOMRect) => void` | fired once after the gif loads and when it's completely in view |
| onGifClick      | `(gif: IGif, e: Event) => void`                                      | fired when the gif is clicked                                   |
| onGifRightClick | `(gif: IGif, e: Event) => void`                                      | fired when the gif is right clicked                             |
