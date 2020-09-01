# @giphy/react-components

[![This project is using Percy.io for visual regression testing.](https://percy.io/static/images/percy-badge.svg)](https://percy.io/d6f633d1/giphy-js)

_React components, focused on ease-of-use and performance._

The GIPHY React SDK lets you and your users easily access the world’s largest GIF library anywhere on your website. Whether it’s via a comment, forum post, review, chatbot or messenger, adding GIFs to your product is a simple and easy way to boost engagement and user experience.

### GIPHY React SDK includes all the same endpoints listed in our Javascript Fetch API:

-   [Search](../packages/fetch-api#search): Search all Giphy GIFs for a word or phrase. Punctuation will be stripped and ignored.
-   [Trending](../packages/fetch-api#trending) Fetch GIFs currently trending online. Hand curated by the Giphy editorial team. The data returned mirrors the GIFs showcased on the Giphy homepage.
-   [GIF by ID](../packages/fetch-api#gif) Fetch detailed information about a GIF by ID
-   [GIFs category and subcategory](../packages/fetch-api#category) Fetch GIFs category and subcategory
-   [Related](../packages/fetch-api#related) Fetch related GIFs based on the ID of a GIF
-   [Random](../packages/fetch-api#random) Returns a random single GIF

To try out it out before integrating, click on the code sandbox below. You may have also seen it in action on Google Chrome extention or Facebook Messenger bot.

### If React isn’t right for you, check out our other SDK repos that may be a better fit:

-   [GIPHY JS SDK](https://github.com/Giphy/giphy-js/blob/master/packages/components/README.md)
-   [GIPHY SDK for iOS](https://github.com/Giphy/giphy-ios-sdk)
-   [GIPHY SDK for Android](https://github.com/Giphy/giphy-android-sdk)

## Try it out:

[![Edit @giphy/react-components](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/giphyreact-components-hbmcf?from-embed)

## Grid

### Bare Bones Example

See [codesandbox](https://codesandbox.io/s/giphyreact-components-hbmcf?from-embed) for runnable code

```tsx
import { Grid } from '@giphy/react-components'
import { GiphyFetch } from '@giphy/js-fetch-api'
// use @giphy/js-fetch-api to fetch gifs
const gf = new GiphyFetch('your api key')
// fetch 10 gifs at a time as the user scrolls (offset is handled by the grid)
const fetchGifs = (offset: number) => gf.trending({ offset, limit: 10 })
// React Component
ReactDOM.render(<Grid width={800} columns={3} gutter={6} fetchGifs={fetchGifs} />, target)
```

### SSR example with next.js

See this [codesanbox](https://codesandbox.io/s/giphy-web-sdk-ssr-with-nextjs-irv19) for an example of SSR with next.js

| _prop_                                  | _type_                                   | _default_ | _description_                                                                                         |
| --------------------------------------- | ---------------------------------------- | --------- | ----------------------------------------------------------------------------------------------------- |
| width                                   | `number`                                 | undefined | The width of the grid                                                                                 |
| fetchGifs                               | `(offset:number) => Promise<GifsResult>` | undefined | A function that returns a Promise<GifsResult>. Use `@giphy/js-fetch-api`                              |
| columns                                 | `number`                                 | 3         | The number of columns in the grid                                                                     |
| gutter                                  | `number`                                 | 6         | The space between columns and rows                                                                    |
| noResultsMessage                        | `string || component`                    | undefined | Customise the "No results" message                                                                    |
| noLink                                  | `boolean`                                | false     | Use a `div` instead of an `a` tag for the Gif component, user defines functionality with `onGifClick` |
| [hideAttribution](#attribution-overlay) | `boolean`                                | false     | Hide the user attribution that appears over a GIF                                                     |
| [Gif Events](#gif-events)               | \*                                       | \*        | see below                                                                                             |

## Carousel

| _prop_                                  | _type_                                   | _default_ | _description_                                                                                         |
| --------------------------------------- | ---------------------------------------- | --------- | ----------------------------------------------------------------------------------------------------- |
| gifHeight                               | `number`                                 | undefined | The height of the gifs and the carousel                                                               |
| fetchGifs                               | `(offset:number) => Promise<GifsResult>` | undefined | A function that returns a Promise<GifsResult>. Use `@giphy/js-fetch-api`                              |
| gutter                                  | `number`                                 | 6         | The space between columns and rows                                                                    |
| noResultsMessage                        | `string || component`                    | undefined | Customise the "No results" message                                                                    |
| noLink                                  | `boolean`                                | false     | Use a `div` instead of an `a` tag for the Gif component, user defines functionality with `onGifClick` |
| [hideAttribution](#attribution-overlay) | `boolean`                                | false     | Hide the user attribution that appears over a GIF                                                     |
| [Gif Events](#gif-events)               | \*                                       | \*        | see below                                                                                             |

See [codesandbox](https://codesandbox.io/s/giphyreact-components-hbmcf?from-embed) for runnable code.

Or see our [storybook](https://giphy.github.io/giphy-js) UI component explorer.

```tsx
import { Carousel } from '@giphy/react-components'
import { GiphyFetch } from '@giphy/js-fetch-api'

// use @giphy/js-fetch-api to fetch gifs
const gf = new GiphyFetch('your api key')
// fetch 10 gifs at a time as the user scrolls (offset is handled by the grid)
const fetchGifs = (offset: number) => gf.trending({ offset, limit: 10 })

// React Component
ReactDOM.render(<Carousel gifHeight={200} gutter={6} fetchGifs={fetchGifs} />, target)
```

## Gif

Displays a single GIF. The building block of the [Grid](#grid) and [Carousel](#carousel). If you want to build a custom layout component,
using this will make it easy to do so.

_Gif props_

| _prop_                                  | _type_                                     | _default_          | _description_                                                                                         |
| --------------------------------------- | ------------------------------------------ | ------------------ | ----------------------------------------------------------------------------------------------------- |
| gif                                     | `IGif`                                     | undefined          | The gif to display                                                                                    |
| width                                   | `number`                                   | undefined          | The width of the gif                                                                                  |
| backgroundColor                         | `string`                                   | random giphy color | The background of the gif before it loads                                                             |
| [hideAttribution](#attribution-overlay) | `boolean`                                  | false              | Hide the user attribution that appears over a GIF                                                     |
| noLink                                  | `boolean`                                  | false              | Use a `div` instead of an `a` tag for the Gif component, user defines functionality with `onGifClick` |
| [overlay](#gif-overlay)                 | `(props: GifOverlayProps):ReactType => {}` | undefined          | see below                                                                                             |
| [Gif Events](#gif-events)               | \*                                         | \*                 | see below                                                                                             |

See [codesandbox](https://codesandbox.io/s/giphyreact-components-hbmcf?from-embed) for runnable code

```tsx
import { Gif } from '@giphy/react-components'
import { GiphyFetch } from '@giphy/js-fetch-api'

// use @giphy/js-fetch-api to fetch gifs
const gf = new GiphyFetch('your api key')
// fetch 10 gifs at a time as the user scrolls (offset is handled by the grid)
const { data } = await gf.gif('fpXxIjftmkk9y')
// React Component
ReactDOM.render(<Gif gif={data} width={300} />, target)
```

### Search Experience

The search experience encompases a search bar and a UI component. The UI component can be the [Grid](#grid) or [#Carousel](#carousel), or a a custom component
that can render an array of Gif objects. To connect the search bar to the UI component, we use `Context`

```tsx
import {
    Grid, // our UI Component to display the results
    SearchBar, // the search bar the user will type into
    SearchContext, // the context that wraps and connects our components
    SearchContextManager, // the context manager, includes the Context.Provider
    SuggestionBar, // an optional UI component that displays trending searches and channel / username results
} from '@giphy/react-components'

// see codesanbox for runnable code
const SearchExperience = () => (
    <SearchContextManager apiKey={apiKey}>
        <Components />
    </SearchContextManager>
)

// define the components in a separate function so we can
// use the context hook
const Components = () => {
    const { fetchGifs, searchKey } = useContext(SearchContext)
    return (
        <>
            <SearchBarComponent />
            <SuggestionBar />
            <Grid key={searchKey} columns={3} width={800} fetchGifs={fetchGifs} />
        </>
    )
}
```

#### SearchContextManager

Theme is passed to the [SearchContextManager](#searchcontextmanager)

| _prop_      | _type_                                                                                                     | _default_     | _description_                                                                    |
| ----------- | ---------------------------------------------------------------------------------------------------------- | ------------- | -------------------------------------------------------------------------------- |
| apiKey      | string                                                                                                     | undefined     | Your api key                                                                     |
| initialTerm | string                                                                                                     | ''            | _Advanced Usage_ a search term to fetch and render when the component is mounted |
| theme       | [SearchTheme](#searchtheme)                                                                                | default theme | A few theming options such as search bar height and dark or light mode           |
| options     | [SearchOptions](https://github.com/Giphy/giphy-js/blob/master/packages/fetch-api/README.md#search-options) | undefined     | Search options that will be passed on to the search request                      |

#### Searchbar

An input field used in the [Search Experience](#search-experience).

| _prop_      | _type_        | _default_      | _description_                                                                |
| ----------- | ------------- | -------------- | ---------------------------------------------------------------------------- |
| placeholder | `string`      | `Search GIPHY` | The text displayed when no text is entered.                                  |
| theme       | `SearchTheme` | default theme  | Some theme properties                                                        |
| clear       | `boolean`     | false          | Advanced use - clears the input but will leave the term in the SearchContext |

#### Search Theme

Theme is passed to the [SearchContextManager](#searchcontextmanager)

| _prop_               | _type_         | _default_ | _description_                                   |
| -------------------- | -------------- | --------- | ----------------------------------------------- |
| mode                 | `dark | light` | `light`   | dark or light                                   |
| searchbarHeight      | number         | 42        | Height of the search bar                        |
| smallSearchbarHeight | number         | 35        | Height of the search bar for mobile media query |

### GifOverlay

The overlay prop, available on all components allows you to overlay a gif with a custom UI and respond to hover events (desktop only).

_Overlay props_

| _prop_    | _type_    | _default_ | _description_                   |
| --------- | --------- | --------- | ------------------------------- |
| gif       | `IGif`    | undefined | The gif that is being displayed |
| isHovered | `boolean` | false     | The current hover state         |

See [codesandbox](https://codesandbox.io/s/giphyreact-components-hbmcf?from-embed) for runnable code

```css
/* css for overlay */
.overlay {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 255, 0, 0.3);
    display: flex;
    color: white;
    justify-content: center;
    align-items: center;
}
```

```tsx
// Overlay component gets GifOverlayProps
const Overlay = ({ gif, isHovered }: GifOverlayProps) => {
    return <div className="overlay">{isHovered ? gif.id : ''}</div>
}

// React component
ReactDOM.render(<Carousel gifHeight={200} fetchGifs={fetchGifs} overlay={Overlay} />, target)
```

### Attribution Overlay

If a GIF has an associated user, an overlay with their avatar and display name will appear. This can be hidden with `hideAttribution` on any of the components. If you provide your own [overlay](#gif-overlay), attribution will be hidden automatically

### Gif Events

| _prop_          | _type_                                                               | _description_                                                   |
| --------------- | -------------------------------------------------------------------- | --------------------------------------------------------------- |
| onGifVisible    | `(gif: IGif, e: SyntheticEvent<HTMLElement, Event>) => void`         | fired every time the gif is show                                |
| onGifSeen       | `(gif: IGif, boundingClientRect: ClientRect &#124; DOMRect) => void` | fired once after the gif loads and when it's completely in view |
| onGifClick      | `(gif: IGif, e: SyntheticEvent<HTMLElement, Event>) => void`         | fired when the gif is clicked                                   |
| onGifRightClick | `(gif: IGif, e: SyntheticEvent<HTMLElement, Event>) => void`         | fired when the gif is right clicked                             |
