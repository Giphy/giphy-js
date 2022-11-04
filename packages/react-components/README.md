# @giphy/react-components

[![This project is using Percy.io for visual regression testing.](https://percy.io/static/images/percy-badge.svg)](https://percy.io/d6f633d1/giphy-js)

_React components, focused on ease-of-use and performance._

The GIPHY React SDK lets you and your users easily access the world’s largest GIF library anywhere on your website. Whether it’s via a comment, forum post, review, chatbot or messenger, adding GIFs to your product is a simple and easy way to boost engagement and user experience.

### GIPHY React SDK includes all the same endpoints listed in our Javascript Fetch API:

-   [Search](../fetch-api#search): Search all Giphy GIFs for a word or phrase. Punctuation will be stripped and ignored.
-   [Trending](../fetch-api#trending) Fetch GIFs currently trending online. Hand curated by the Giphy editorial team. The data returned mirrors the GIFs showcased on the Giphy homepage.
-   [GIF by ID](../fetch-api#gif) Fetch detailed information about a GIF by ID
-   [GIFs category and subcategory](../fetch-api#category) Fetch GIFs category and subcategory
-   [Related](../fetch-api#related) Fetch related GIFs based on the ID of a GIF
-   [Random](../fetch-api#random) Returns a random single GIF

To try out it out before integrating, click on the code sandbox below. You may have also seen it in action on Google Chrome extention or Facebook Messenger bot.

### If React isn’t right for you, check out our other SDK repos that may be a better fit:

-   [GIPHY JS SDK](https://github.com/Giphy/giphy-js/blob/master/packages/components/README.md)
-   [GIPHY SDK for iOS](https://github.com/Giphy/giphy-ios-sdk)
-   [GIPHY SDK for Android](https://github.com/Giphy/giphy-android-sdk)

## Try it out:

[![Edit @giphy/react-components](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/giphyreact-components-hbmcf?from-embed)

## Storybook:

[storybook](https://giphy.github.io/giphy-js) UI component explorer.

## Grid

| _prop_                                  | _type_                                   | _default_ | _description_                                                                                           |
| --------------------------------------- | ---------------------------------------- | --------- | ------------------------------------------------------------------------------------------------------- |
| width                                   | `number`                                 | undefined | The width of the grid                                                                                   |
| fetchGifs                               | `(offset:number) => Promise<GifsResult>` | undefined | A function that returns a Promise<GifsResult>. Use `@giphy/js-fetch-api`                                |
| columns                                 | `number`                                 | 3         | The number of columns in the grid                                                                       |
| gutter                                  | `number`                                 | 6         | The space between columns and rows                                                                      |
| borderRadius                            | `number`                                 | 4         | a border radius applied to Gif Components making the corners rounded                                    |
| noResultsMessage                        | `string or JSX.Element`                  | undefined | Customize the "No results" message                                                                      |
| loader                                  | `ElementType`                            | undefined | Customize the loader, the default is the GIPHY brand loader                                             |
| noLink                                  | `boolean`                                | false     | Use a `div` instead of an `a` tag for the Gif component, user defines functionality with `onGifClick`   |
| [hideAttribution](#attribution-overlay) | `boolean`                                | false     | Hide the user attribution that appears over a GIF                                                       |
| [loaderConfig](#loader-config)          | `IntersectionObserverInit`               | undefined | Enables configuring the loader to fetch sooner than when just onscreen, allowing for smoother scrolling |
| [Gif Events](#gif-events)               | \*                                       | \*        | see below                                                                                               |

### Bare Bones Example

See [codesandbox](https://codesandbox.io/s/giphyreact-components-hbmcf?from-embed) for runnable code

```tsx
import { Grid } from '@giphy/react-components'
import { GiphyFetch } from '@giphy/js-fetch-api'
// use @giphy/js-fetch-api to fetch gifs
// apply for a new Web SDK key. Use a separate key for every platform (Android, iOS, Web)
const gf = new GiphyFetch('your Web SDK key')

const searchTerm = 'dogs'
// fetch 10 gifs at a time as the user scrolls (offset is handled by the grid)
// if this function changes, change the Grid key to recreate the grid and start over
// see the codesandbox for a runnable example
const fetchGifs = (offset: number) => gf.search(searchTerm, { offset, limit: 10 })
// React Component
ReactDOM.render(<Grid width={800} columns={3} gutter={6} fetchGifs={fetchGifs} key={searchTerm} />, target)
```

### SSR example with next.js

See this [codesandbox](https://codesandbox.io/s/giphy-web-sdk-ssr-with-nextjs-irv19) for an example of SSR with next.js

## Carousel

| _prop_                                  | _type_                                   | _default_ | _description_                                                                                                               |
| --------------------------------------- | ---------------------------------------- | --------- | --------------------------------------------------------------------------------------------------------------------------- |
| gifHeight                               | `number`                                 | undefined | The height of the gifs and the carousel                                                                                     |
| gifWidth                                | `number`                                 | undefined | The width of the gifs and the carousel (you may want to set Gif.imgClassName to have object-fit: cover to avoid stretching) |
| fetchGifs                               | `(offset:number) => Promise<GifsResult>` | undefined | A function that returns a Promise<GifsResult>. Use `@giphy/js-fetch-api`                                                    |
| gutter                                  | `number`                                 | 6         | The space between columns and rows                                                                                          |
| borderRadius                            | `number`                                 | 4         | a border radius applied to Gif Components making the corners rounded                                                        |
| noResultsMessage                        | `string or JSX.Element`                  | undefined | Customize the "No results" message                                                                                          |
| noLink                                  | `boolean`                                | false     | Use a `div` instead of an `a` tag for the Gif component, user defines functionality with `onGifClick`                       |
| [hideAttribution](#attribution-overlay) | `boolean`                                | false     | Hide the user attribution that appears over a GIF                                                                           |
| [loaderConfig](#loader-config)          | `IntersectionObserverInit`               | undefined | Enables configuring the loader to fetch sooner than when just onscreen, allowing for smoother scrolling                     |
| [Gif Events](#gif-events)               | \*                                       | \*        | see below                                                                                                                   |

See [codesandbox](https://codesandbox.io/s/giphyreact-components-hbmcf?from-embed) for runnable code.

Or see our [storybook](https://giphy.github.io/giphy-js) UI component explorer.

```tsx
import { Carousel } from '@giphy/react-components'
import { GiphyFetch } from '@giphy/js-fetch-api'

// use @giphy/js-fetch-api to fetch gifs
const gf = new GiphyFetch('your api key')
const searchTerm = 'dogs'
// fetch 10 gifs at a time as the user scrolls (offset is handled by the grid)
// if this function changes, change the Grid key to recreate the grid and start over
// see the codesandbox for a runnable example
const fetchGifs = (offset: number) => gf.search(searchTerm, { offset, limit: 10 })
// React Component
ReactDOM.render(<Carousel gifHeight={200} gutter={6} fetchGifs={fetchGifs} key={searchTerm} />, target)
```

## Gif

Displays a single GIF. The building block of the [Grid](#grid) and [Carousel](#carousel). If you want to build a custom layout component,
using this will make it easy to do so.

_Gif props_

| _prop_                                  | _type_                                     | _default_          | _description_                                                                                         |
| --------------------------------------- | ------------------------------------------ | ------------------ | ----------------------------------------------------------------------------------------------------- |
| gif                                     | `IGif`                                     | undefined          | The gif to display                                                                                    |
| width                                   | `number`                                   | undefined          | The width of the gif                                                                                  |
| borderRadius                            | `number`                                   | 4                  | a border radius making the corners rounded                                                            |
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
// apply for a new Web SDK key. Use a separate key for every platform (Android, iOS, Web)
const gf = new GiphyFetch('your Web SDK key')
// fetch single gif
const { data } = await gf.gif('fpXxIjftmkk9y')
// React Component
ReactDOM.render(<Gif gif={data} width={300} />, target)
```

### Search Experience

The search experience is built on a search bar and a separate visual component that can display content, which can be a [Grid](#grid) or [Carousel](#carousel), or a custom component that can fetch and render an array of `IGif` objects. To create the search experience, we use `React.Context` to set up communication between the search bar and other components by defining them as children of a [SearchContextManager](#searchcontextmanager). We recommend using the [SuggestionBar](#suggestionbar) to display trending searches and enable username searches when a user searches by username (e.g. `@nba`).

See [codesandbox](https://codesandbox.io/s/giphyreact-components-hbmcf?from-embed) for runnable code

```tsx
import {
    Grid, // our UI Component to display the results
    SearchBar, // the search bar the user will type into
    SearchContext, // the context that wraps and connects our components
    SearchContextManager, // the context manager, includes the Context.Provider
    SuggestionBar, // an optional UI component that displays trending searches and channel / username results
} from '@giphy/react-components'

// the search experience consists of the manager and its child components that use SearchContext
const SearchExperience = () => (
    <SearchContextManager apiKey={webSDKKey}>
        <Components />
    </SearchContextManager>
)

// define the components in a separate function so we can
// use the context hook. You could also use the render props pattern
const Components = () => {
    const { fetchGifs, searchKey } = useContext(SearchContext)
    return (
        <>
            <SearchBarComponent />
            <SuggestionBar />
            {/** 
                key will recreate the component, 
                this is important for when you change fetchGifs 
                e.g. changing from search term dogs to cats or type gifs to stickers
                you want to restart the gifs from the beginning and changing a component's key does that 
            **/}
            <Grid key={searchKey} columns={3} width={800} fetchGifs={fetchGifs} />
        </>
    )
}
```

#### SearchContextManager

This component manages the [SearchContext](#searchcontext) that the child components access.

It has a few initialization props:

| _prop_                  | _type_                                                                                                     | _default_     | _description_                                                                                                                                                                                         |
| ----------------------- | ---------------------------------------------------------------------------------------------------------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| apiKey                  | string                                                                                                     | undefined     | Your web SDK key. Use a separate key for every platform (Android, iOS, Web)                                                                                                                           |
| initialTerm             | string                                                                                                     | ''            | _Advanced usage_ a search term to fetch and render when the component is mounted                                                                                                                      |
| shouldDefaultToTrending | boolean                                                                                                    | true          | when there is no search term, fetch trending (includes `options` that are relevant e.g. limit, type)                                                                                                  |
| shouldFetchChannels     | boolean                                                                                                    | true          | Fetch channels while the term changes, enabling them to be displayed in a SuggestionBar. If the search term is @term and a channel is found that matches, the search bar will display in channel mode |
| theme                   | [SearchTheme](#searchtheme)                                                                                | default theme | A few theming options such as search bar height and dark or light mode                                                                                                                                |
| options                 | [SearchOptions](https://github.com/Giphy/giphy-js/blob/master/packages/fetch-api/README.md#search-options) | undefined     | Search options that will be passed on to the search request                                                                                                                                           |

#### Searchbar

An input field used in the [Search Experience](#search-experience).

| _prop_      | _type_        | _default_      | _description_                                                                     |
| ----------- | ------------- | -------------- | --------------------------------------------------------------------------------- |
| placeholder | `string`      | `Search GIPHY` | The text displayed when no text is entered                                        |
| theme       | `SearchTheme` | default theme  | See (SearchTheme)[#searchtheme]                                                   |
| clear       | `boolean`     | false          | _Advanced useage_ - clears the input but will leave the term in the SearchContext |

#### SearchContext

The `SearchContext` manages the state of the search experience. The props below are all you need to configure your UI component. See (Search Experience)[#search-experience].
It should use `searchKey` as its key, so when we have a new search, the old content is removed. And it will need a `fetchGifs` to initiate the first fetch and for subsequent infinite scroll fetches

| _prop_          | _type_                                    | _default_            | _description_                                                                       |
| --------------- | ----------------------------------------- | -------------------- | ----------------------------------------------------------------------------------- |
| searchKey       | string                                    | undefined            | A unique id of the current search, used as a React key to refresh the [Grid](#grid) |
| isFocused       | boolean                                   | false                | whether or not the search input has focus                                           |
| currentChannels | IChannel[]                                | []                   | an array of channels that were found with the current search term                   |
| fetchGifs       | `(offset: number) => Promise<GifsResult>` | default search fetch | The search request passed to the UI component                                       |

#### SearchTheme

Theme is passed to the [SearchContextManager](#searchcontextmanager)

| _prop_               | _type_            | _default_ | _description_                                             |
| -------------------- | ----------------- | --------- | --------------------------------------------------------- |
| mode                 | `dark` \| `light` | `light`   | dark or light                                             |
| searchbarHeight      | number            | 42        | Height of the search bar                                  |
| smallSearchbarHeight | number            | 35        | Height of the search bar when matching mobile media query |

#### SuggestionBar

Display scrolling trending searches and username search. When clicking a trending search term, the search input will be
populated with that term and the search will be fetched and rendered.

If a user types a username into the search bar such as `@nba`, a username search will done and the all the channels that match will be displayed in the suggestion bar. When clicking a username, the search bar will go into username search mode.

## Video

Quick and easy way to play video. Just pass the video component a gif object that has a video property. This is true when using `{ type: 'videos' }` in the [fetch api type option](https://github.com/Giphy/giphy-js/blob/master/packages/fetch-api/README.md#type-option).

If you want controls for the video player, use the `controls` property.

Here are the components in action in our [storybook](https://giphy.github.io/giphy-js/?path=/story/react-components-video-player)

_Video props_

| _prop_             | _type_                     | _default_ | _description_                                    |
| ------------------ | -------------------------- | --------- | ------------------------------------------------ |
| gif                | `IGif`                     | undefined | The gif to display that contains video data      |
| width              | `number`                   | undefined | The width of the video                           |
| height             | `number`                   | undefined | The height of the video                          |
| controls           | `boolean`                  | undefined | Show transport controls                          |
| hideProgressBar    | `boolean`                  | undefined | if controls is true, hides progress bar          |
| hideMute           | `boolean`                  | undefined | if controls is true, hides the mute button       |
| hidePlayPause      | `boolean`                  | undefined | if controls is true, hides the play/pause button |
| persistentControls | `boolean`                  | undefined | don't hide controls when hovering away           |
| ccEnabled          | `boolean`                  | false     | if true, show captions                           |
| ccLanguage         | `string`                   | 'en'      | the closed caption language                      |
| onUserMuted        | `(muted: boolean) => void` | undefined | fired when the user toggles the mute state       |

```tsx
import { Video } from '@giphy/react-components'
import { GiphyFetch } from '@giphy/js-fetch-api'

// use @giphy/js-fetch-api to fetch gifs
// apply for a new Web SDK key. Use a separate key for every platform (Android, iOS, Web)
const gf = new GiphyFetch('your Web SDK key')

const { data } = await gf.gif('D068R9Ziv1iCjezKzG')
// React Component
ReactDOM.render(<Video gif={data} width={300} controls />, target)
```

## EmojiVariationsList

This component is designed to display a list of variations for a given emoji.

Here are the components in action in our [storybook](https://giphy.github.io/giphy-js/?path=path=/story/react-components-emoji-variations-list--default)

| _prop_                                  | _type_                                              | _default_ | _description_                                                                                         |
| --------------------------------------- | --------------------------------------------------- | --------- | ----------------------------------------------------------------------------------------------------- |
| fetchVariations                         | `(gifId: GifID) => Promise<NonPaginatedGifsResult>` | undefined | The async callback that should return emoji variations. Use `@giphy/js-fetch-api`                     |
| gif                                     | `IGif`                                              | undefined | Specifies for which gif to display variations                                                         |
| gifHeight                               | `number`                                            | undefined | The height of the gifs in the list                                                                    |
| gifWidth                                | `number`                                            | undefined | The width of the gifs in the list                                                                     |
| backgroundColor                         | `string`                                            | '#2e2e2e' | Set the background color for the list                                                                 |
| dividerColor                            | `string`                                            | '#4e4e4e' | Set the color for the divider                                                                         |
| gutter                                  | `number`                                            | 6         | The space between the gifs                                                                            |
| loader                                  | `ElementType`                                       | undefined | Specifies the loader                                                                                  |
| noLink                                  | `boolean`                                           | false     | Use a `div` instead of an `a` tag for the Gif component, user defines functionality with `onGifClick` |
| onVariationsFetched                     | `(gifs: IGif[]) => void`                            | undefined | The callback that will be called when variations are fetched                                          |
| [hideAttribution](#attribution-overlay) | `boolean`                                           | false     | Hide the user attribution that appears over a GIF                                                     |
| [GifProps](#gif)                        | `GifProps`                                          | undefined | Props applied to the [Gif](#gif) element                                                              |
| [Gif Events](#gif-events)               | \*                                                  | \*        | see below                                                                                             |

_Example_:

```tsx
import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { GiphyFetch } from '@giphy/js-fetch-api'
import { EmojiVariationsList, Grid } from '@giphy/react-components'
import type { GifID, IGif } from '@giphy/js-types'

// use @giphy/js-fetch-api to fetch gifs
// apply for a new Web SDK key. Use a separate key for every platform (Android, iOS, Web)
const gf = new GiphyFetch('your Web SDK key')

const fetchDefaultVariations = (offset: number) => gf.emojiDefaultVariations({ offset })
const fetchVariations = (id: GifID) => gf.emojiVariations(id)

export function Example() {
    const [gif, setGif] = useState<IGif | null>(null)
    return (
        <>
            {gif ? <EmojiVariationsList fetchVariations={fetchVariations} gif={gif} gifHeight={100} /> : null}
            <Grid
                columns={3}
                fetchGifs={fetchDefaultVariations}
                hideAttribution={true}
                noLink={true}
                onGifClick={setGif}
                width={400}
            />
        </>
    )
}

ReactDOM.render(<Example />, target)
```

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

### Loader Config

If you want to prefetch network requests before the loader appears in Grids and Carousels, you can do so by configuring `loaderConfig`. This config is actually just the options that are passed to [IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API), which is in charge of monitoring the Loader and firing an event when it appears on screen. This is configured in a util component called [Observer](https://github.com/Giphy/giphy-js/blob/master/packages/react-components/src/util/observer.tsx)

### Gif Events

| _prop_          | _type_                                                               | _description_                                                   |
| --------------- | -------------------------------------------------------------------- | --------------------------------------------------------------- |
| onGifVisible    | `(gif: IGif, e: SyntheticEvent<HTMLElement, Event>) => void`         | fired every time the gif is show                                |
| onGifSeen       | `(gif: IGif, boundingClientRect: ClientRect &#124; DOMRect) => void` | fired once after the gif loads and when it's completely in view |
| onGifClick      | `(gif: IGif, e: SyntheticEvent<HTMLElement, Event>) => void`         | fired when the gif is clicked                                   |
| onGifRightClick | `(gif: IGif, e: SyntheticEvent<HTMLElement, Event>) => void`         | fired when the gif is right clicked                             |
| onGifKeyPress   | `(gif: IGif, e: SyntheticEvent<HTMLElement, Event>) => void`         | fired when the a key is pressed on the gif                      |

To stop fonts from loading set the environment variable `GIPHY_SDK_NO_FONTS=true`, this is not recommended as it could cause inconsistencies in the ui components
