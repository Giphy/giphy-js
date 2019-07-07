# @giphy/js-components

A lightweight set of components, focused on ease-of-use and performance.

## Try it out:

[![Edit @giphy/js-components](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/1wq52x1w44?fontsize=14)

## Grid

Use `renderGrid(props, target)` to render a grid to a target element

### Bare Bones Example

```typescript
import { renderGrid } from '@giphy/js-components'
import { GiphyFetch } from '@giphy/js-fetch-api'

// create a GIPHY API client with your api key
const gf = new GiphyFetch('your api key')
// create a fetch gifs function that takes an `offset` parameter
// this will allow the grid to paginate as the user scrolls
const fetchGifs = (offset: number) => gf.trending({ offset, limit: 10 })
// render a grid
const targetEl = window.document.getElementById('giphy-grid')
renderGrid({ width: 800, columns: 3, gutter: 6, fetchGifs }, targetEl)
```

<!-- The grid uses [bricks.js]() to render a grid with fixed width items. -->

_renderGrid options_

| _prop_                    | _type_                                   | _default_             | _description_                                                            |
| ------------------------- | ---------------------------------------- | --------------------- | ------------------------------------------------------------------------ |
| width                     | `number`                                 | document width or 800 | The width of the grid                                                    |
| columns                   | `number`                                 | 3                     | The number of columns in the grid                                        |
| gutter                    | `number`                                 | 6                     | The space between columns and rows                                       |
| fetchGifs                 | `(offset:number) => Promise<GifsResult>` | undefined             | A function that returns a Promise<GifsResult>. Use `@giphy/js-fetch-api` |
| targetEl                  |  `HTMLElement`                           | undefined             | Target element into which the grid is rendered                           |
| [Gif Events](#gif-events) | \*                                       | \*                    | see below                                                                |

### Thorough Example

```typescript
import { throttle } from 'throttle-debounce'
import { renderGrid } from '@giphy/js-components'
import { GiphyFetch } from '@giphy/js-fetch-api'

// create a GIPHY API client with your api key
const gf = new GiphyFetch('your api key')

// create a fetch gifs function that takes an `offset` parameter
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
| gutter                    | `number`                                 | 6         | The space between columns and rows                                       |
| fetchGifs                 | `(offset:number) => Promise<GifsResult>` | undefined | A function that returns a Promise<GifsResult>. Use `@giphy/js-fetch-api` |
| [Gif Events](#gif-events) | \*                                       | \*        | see below                                                                |

```typescript
import { renderCarousel } from '@giphy/js-components'
import { GiphyFetch } from '@giphy/js-fetch-api'

// create a GIPHY API client with your api key
const gf = new GiphyFetch('your api key')

export const vanillaJSCarousel = (mountNode: HTMLElement) => {
    renderCarousel(
        {
            gifHeight: 200,
            fetchGifs: (offset: number) => gf.trending({ offset }),
            gutter: 6,
            onGifClick: (gif: IGif) => window.open(gif.url),
        },
        mountNode
    )
}

vanillaJSCarousel(window.document.getElementById('giphy-carousel'))
```

## Gif

_Gif props_

| _prop_                    | _type_   | _default_          | _description_                             |
| ------------------------- | -------- | ------------------ | ----------------------------------------- |
| gif                       | `IGif`   | undefined          | The gif to display                        |
| width                     | `number` | undefined          | The width of the gif                      |
| backgroundColor           | `string` | random giphy color | The background of the gif before it loads |
| [Gif Events](#gif-events) | \*       | \*                 | see below                                 |


```javascript
import { GiphyFetch } from '@giphy/js-fetch-api'
import { renderGif } from '@giphy/js-components'

(async () => {
    const gf = new GiphyFetch('your api key')
    const { data: gif } = await gf.gif('fpXxIjftmkk9y')
    renderGif({
        gif,
        width: parseInt(gif['images']['original']['width'])
    }, window.document.getElementById('giphy-gif'))
})()
```

### Gif Events

| property        | type                                                                 | description                                                     |
| --------------- | -------------------------------------------------------------------- | --------------------------------------------------------------- |
| onGifHover      | `(gif: IGif, e: Event) => void`                                      | fired on desktop when hovered over                              |
| onGifUnhover    | `(gif: IGif, e: Event) => void`                                      | fired on desktop on mouse out, given an active hover event      |
| onGifVisible    | `(gif: IGif, e: Event) => void`                                      | fired every time the gif is shown                               |
| onGifSeen       | `(gif: IGif, boundingClientRect: ClientRect | DOMRect) => void`      | fired once after the gif loads and when it's completely in view |
| onGifClick      | `(gif: IGif, e: Event) => void`                                      | fired when the gif is clicked                                   |
| onGifRightClick | `(gif: IGif, e: Event) => void`                                      | fired when the gif is right clicked                             |
