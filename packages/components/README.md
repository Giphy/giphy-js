# @giphy/js-components

A lightweight set of components, focused on ease-of-use and performance.

## Try it out:

[![Edit @giphy/js-components](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/1wq52x1w44?fontsize=14)

## Grid

Use `renderGrid(props, target)` to render a grid to a target element

### Bare Bones Example

```typescript
// use @giphy/js-fetch-api to fetch gifs
// apply for a new Web SDK key. Use a separate key for every platform (Android, iOS, Web)
const gf = new GiphyFetch('your Web SDK key')
// fetch 10 gifs at a time as the user scrolls (offset is handled by the grid)
const fetchGifs = (offset: number) => gf.trending({ offset, limit: 10 })
// render a grid
renderGrid({ width: 800, fetchGifs }, targetEl)
```

<!-- The grid uses [bricks.js]() to render a grid with fixed width items. -->

_renderGrid options_

| _prop_                                  | _type_                                   | _default_ | _description_                                                                                         |
| --------------------------------------- | ---------------------------------------- | --------- | ----------------------------------------------------------------------------------------------------- |
| width                                   | `number`                                 | undefined | The width of the grid                                                                                 |
| fetchGifs                               | `(offset:number) => Promise<GifsResult>` | undefined | A function that returns a Promise<GifsResult>. Use `@giphy/js-fetch-api`                              |
| columns                                 | `number`                                 | 3         | The number of columns in the grid                                                                     |
| gutter                                  | `number`                                 | 6         | The space between columns and rows                                                                    |
| noResultsMessage                        | `string                                  |           | element`                                                                                              | undefined | Customise the "No results" message |
| noLink                                  | `boolean`                                | false     | Use a `div` instead of an `a` tag for the Gif component, user defines functionality with `onGifClick` |
| [hideAttribution](#attribution-overlay) | `boolean`                                | false     | Hide the user attribution that appears over a                                                         |
| [Gif Events](#gif-events)               | \*                                       | \*        | see below                                                                                             |

### Thorough Example

```typescript
import { throttle } from 'throttle-debounce'
import { renderGrid } from '@giphy/js-components'
import { GiphyFetch } from '@giphy/js-fetch-api'

// create a GiphyFetch with your api key
// apply for a new Web SDK key. Use a separate key for every platform (Android, iOS, Web)
const gf = new GiphyFetch('your Web SDK key')
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
    const remove = render()
    return {
        remove: () => {
            remove()
            window.removeEventListener('resize', resizeRender, false)
        },
    }
}

// Instantiate
const grid = makeGrid(document.querySelector('.grid'))

// To remove
grid.remove()
```

## Carousel

_renderCarousel options_

| property                                | type                                     | default   | description                                                                                           |
| --------------------------------------- | ---------------------------------------- | --------- | ----------------------------------------------------------------------------------------------------- |
| gifHeight                               | `number`                                 | undefined | The height of the gifs and the carousel                                                               |
| fetchGifs                               | `(offset:number) => Promise<GifsResult>` | undefined | A function that returns a Promise<GifsResult>. Use `@giphy/js-fetch-api`                              |
| gutter                                  | `number`                                 | 6         | The space between columns and rows                                                                    |
| noResultsMessage                        | `string                                  |           | element`                                                                                              | undefined | Customise the "No results" message |
| [hideAttribution](#attribution-overlay) | `boolean`                                | false     | Hide the user attribution that appears over a                                                         |
| noLink                                  | `boolean`                                | false     | Use a `div` instead of an `a` tag for the Gif component, user defines functionality with `onGifClick` |
| [Gif Events](#gif-events)               | \*                                       | \*        | see below                                                                                             |

```typescript
import { renderCarousel } from '@giphy/js-components'
import { GiphyFetch } from '@giphy/js-fetch-api'

// create a GiphyFetch with your api key
// apply for a new Web SDK key. Use a separate key for every platform (Android, iOS, Web)
const gf = new GiphyFetch('your Web SDK key')

// Creating a grid with window resizing and remove-ability
const vanillaJSCarousel = (mountNode: HTMLElement) => {
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
```

## Gif

_Gif props_

| _prop_                                  | _type_    | _default_          | _description_                                                                                         |
| --------------------------------------- | --------- | ------------------ | ----------------------------------------------------------------------------------------------------- |
| gif                                     | `IGif`    | undefined          | The gif to display                                                                                    |
| width                                   | `number`  | undefined          | The width of the gif                                                                                  |
| backgroundColor                         | `string`  | random giphy color | The background of the gif before it loads                                                             |
| [hideAttribution](#attribution-overlay) | `boolean` | false              | Hide the user attribution that appears over a GIF                                                     |
| noLink                                  | `boolean` | false              | Use a `div` instead of an `a` tag for the Gif component, user defines functionality with `onGifClick` |
| [Gif Events](#gif-events)               | \*        | \*                 | see below                                                                                             |

```typescript
import { renderGif } from '@giphy/js-components'
import { GiphyFetch } from '@giphy/js-fetch-api'

// create a GiphyFetch with your api key
// apply for a new Web SDK key. Use a separate key for every platform (Android, iOS, Web)
const gf = new GiphyFetch('your Web SDK key')

const vanillaJSGif = async (mountNode: HTMLElement) => {
    // render a single gif
    const { data: gif1 } = await gf.gif('fpXxIjftmkk9y')
    renderGif({ gif: gif1, width: 300 }, mountNode)
}
```

## Video

_Video props_

| _prop_ | _type_   | _default_ | _description_                               |
| ------ | -------- | --------- | ------------------------------------------- |
| gif    | `IGif`   | undefined | The gif to display that contains video data |
| width  | `number` | undefined | The width of the video                      |
| height | `number` | undefined | The height of the video                     |

```typescript
import { renderVideo } from '@giphy/js-components'
import { GiphyFetch } from '@giphy/js-fetch-api'

// create a GiphyFetch with your api key
// apply for a new Web SDK key. Use a separate key for every platform (Android, iOS, Web)
const gf = new GiphyFetch('your Web SDK key')

const vanillaJSVideo = async (mountNode: HTMLElement) => {
    // render a video
    const { data: gif1 } = await gf.gif('D068R9Ziv1iCjezKzG')
    renderVideo({ gif: gif1, width: 300 }, mountNode)
}
```

### Attribution Overlay

If a GIF has an associated user, an overlay with their avatar and display name will appear. This can be hidden with `hideAttribution` on any of the components.

### Gif Events

| property        | type                                                                 | description                                                     |
| --------------- | -------------------------------------------------------------------- | --------------------------------------------------------------- |
| onGifHover      | `(gif: IGif, e: Event) => void`                                      | fired on desktop when hovered for                               |
| onGifVisible    | `(gif: IGif, e: Event) => void`                                      | fired every time the gif is show                                |
| onGifSeen       | `(gif: IGif, boundingClientRect: ClientRect &#124; DOMRect) => void` | fired once after the gif loads and when it's completely in view |
| onGifClick      | `(gif: IGif, e: Event) => void`                                      | fired when the gif is clicked                                   |
| onGifRightClick | `(gif: IGif, e: Event) => void`                                      | fired when the gif is right clicked                             |

```

```
