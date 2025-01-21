## @giphy/react-components

## 9.8.1-beta.0

### Patch Changes

-   24cedc5: responsive grid

## 9.8.0

### Minor Changes

-   e73400e: move bottle data outside of picture tag

## 9.7.1

### Patch Changes

-   f3dcc43: change bottle tag approach

## 9.7.0

### Minor Changes

-   1125e6e: fix bottle data injection and replace magic tags

### Patch Changes

-   Updated dependencies [1125e6e]
    -   @giphy/js-util@5.2.0

## 9.6.0

### Minor Changes

-   7eb17c5: video player tweaks: hide title / fix SSR loop error

## 9.5.1

### Patch Changes

-   6096058: Video player can use percentage width

## 9.5.0

### Minor Changes

-   94158d9: - moat tracking in react components
    -   remove unused deps in util
    -   append bottle data in fetch-api
    -   update types for gif to include bottle_data

### Patch Changes

-   Updated dependencies [94158d9]
    -   @giphy/js-fetch-api@5.5.0
    -   @giphy/js-types@5.1.0
    -   @giphy/js-util@5.1.0

## 9.4.1

### Patch Changes

-   2c48543: In order to avoid console warnings, dont' use fetchPriority prop until next React release

    https://github.com/facebook/react/issues/27233

## 9.4.0

### Minor Changes

-   eef27e2: Readme updates for react, js, and svelte components to provide information re: pingbacks

### Patch Changes

-   69c5a20: - Grid supports editableGifs
    -   make fetchpriority lowercase to avoid runtime warning

## 9.3.0

### Minor Changes

-   6534ea6: add fetchpriority prop to Gif component

### Patch Changes

-   Updated dependencies [3b5e333]
    -   @giphy/js-fetch-api@5.4.0

## 9.2.3

### Patch Changes

-   25266c7: react-components: add 'use client' to barrel file (index.ts) in root of package
    so tsup doesn't treeshake it out

    See: https://github.com/egoist/tsup/issues/835

## 9.2.2

### Patch Changes

-   4313749: add 'use client' in react components so they can be used in Next.js App Router more easily

## 9.2.1

### Patch Changes

-   30ccd9f: fix ssr hydration warning in styled component

## 9.2.0

### Minor Changes

-   55719f8: - mute video overlay on document visibility change
    -   invoke onEnter with text value when clicking on the search bar button
    -   add display: block and width/height 100% to picture element inside gif component: picture set to display: block is a common css reset, but if that is set then width and height need to be set to 100% in order for object-fit to work

## 9.1.0

### Minor Changes

-   a0cb3bb: update search bar button design

    -   change gradient colors of search button
    -   reduce size of magnifying glass in search button
    -   remove border radius of search button on left side

## 9.0.1

### Patch Changes

-   3013bfd: Fix React warnings about styled component props

## 9.0.0

### Major Changes

-   02aa2b7: styled components is a peer/dev dependency as requested in the [documentation](https://styled-components.com/docs/faqs#i-am-a-library-author.-should-i-bundle-styled-components-with-my-library)

    Depending on your package manager, you may need to install peer dependencies

## 8.1.0

### Minor Changes

-   ad0f108: react-components: percentWidth prop on gif allows you to display a Gif component using a css percentage value

    fetch-api: add type videos to related end point

### Patch Changes

-   Updated dependencies [ad0f108]
    -   @giphy/js-fetch-api@5.1.0

## 8.0.0

### Major Changes

-   22868d0: Switch from emotion to styled components.

    Some of the theme properties on search bar have been renamed:

    -   smallSearchbarHeight: use `mobileSearchbarHeight` instead
    -   condensedMediaQuery: use `mobileMediaQuery` instead

### Patch Changes

-   207beac: Revert grid refactor to hooks - too many edge case bugs

## 7.1.1

### Patch Changes

-   5915f65: Add colors package
    Remove @giphy/js-brand from react-components, use colors
-   Updated dependencies [5915f65]
    -   @giphy/colors@1.0.1

## 7.1.0

### Minor Changes

-   cda870e: a11y: remove css that hides keyboard focus

## 7.0.1

### Patch Changes

-   9914802: util, analytics, fetch-api and brand are all type: module now. See [here](https://github.com/Giphy/giphy-js/pull/391#issue-1770394467) for more info

    ## Possible breaking change

    The output format has changed. If you are accessing files in dist, your build will fail.

-   Updated dependencies [9914802]
    -   @giphy/js-analytics@5.0.0
    -   @giphy/js-fetch-api@5.0.0
    -   @giphy/js-brand@3.0.0
    -   @giphy/js-util@5.0.0

## 7.0.0

### Major Changes

-   c57c246: Upgrading Grid from React Classes to React Hooks

## 6.9.4

### Patch Changes

-   8c8e8d6: Add types to package.json export field
-   Updated dependencies [8c8e8d6]
    -   @giphy/js-analytics@4.3.2
    -   @giphy/js-fetch-api@4.9.2
    -   @giphy/js-brand@2.3.2
    -   @giphy/js-util@4.4.2

## 6.9.3

### Patch Changes

-   9418497: dependency upgrades
-   Updated dependencies [9418497]
    -   @giphy/js-analytics@4.3.1
    -   @giphy/js-fetch-api@4.9.1
    -   @giphy/js-brand@2.3.1
    -   @giphy/js-util@4.4.1

#### feature

-   `fetch-api`, `react-components`
    -   [#315](https://github.com/Giphy/giphy-js/pull/315) React components - search bar updates ([@giannif](https://github.com/giannif))

#### build tools & continuous integration

-   `react-components`
    -   [#313](https://github.com/Giphy/giphy-js/pull/313) chore: cover the main components with basic tests ([@pshoniuk](https://github.com/pshoniuk))

#### Committers: 2

-   Gianni Ferullo ([@giannif](https://github.com/giannif))
-   Valentine ([@pshoniuk](https://github.com/pshoniuk))

## @giphy/js-fetch-api@4.4.0 (2022-08-03)

#### feature

-   `fetch-api`, `react-components`
    -   [#315](https://github.com/Giphy/giphy-js/pull/315) React components - search bar updates ([@giannif](https://github.com/giannif))

#### build tools & continuous integration

-   `react-components`
    -   [#313](https://github.com/Giphy/giphy-js/pull/313) chore: cover the main components with basic tests ([@pshoniuk](https://github.com/pshoniuk))

#### Committers: 2

-   Gianni Ferullo ([@giannif](https://github.com/giannif))
-   Valentine ([@pshoniuk](https://github.com/pshoniuk))

## @giphy/js-components@5.8.1 (2022-08-03)

#### feature

-   `fetch-api`, `react-components`
    -   [#315](https://github.com/Giphy/giphy-js/pull/315) React components - search bar updates ([@giannif](https://github.com/giannif))

#### build tools & continuous integration

-   `react-components`
    -   [#313](https://github.com/Giphy/giphy-js/pull/313) chore: cover the main components with basic tests ([@pshoniuk](https://github.com/pshoniuk))

#### Committers: 2

-   Gianni Ferullo ([@giannif](https://github.com/giannif))
-   Valentine ([@pshoniuk](https://github.com/pshoniuk))

## @giphy/react-components@5.13.0 (2022-07-27)

#### feature

-   `react-components`
    -   [#314](https://github.com/Giphy/giphy-js/pull/314) react-components: search debounce configurable ([@giannif](https://github.com/giannif))

#### build tools & continuous integration

-   `react-components`
    -   [#310](https://github.com/Giphy/giphy-js/pull/310) chore: cypress setup ([@pshoniuk](https://github.com/pshoniuk))

#### Committers: 2

-   Gianni Ferullo ([@giannif](https://github.com/giannif))
-   Valentine ([@pshoniuk](https://github.com/pshoniuk))

## @giphy/react-components@5.11.1 (2022-07-13)

#### refactor

-   `components`, `react-components`
    -   [#306](https://github.com/Giphy/giphy-js/pull/306) build(deps): update react, emotion, typescript & storybook ([@pshoniuk](https://github.com/pshoniuk))

#### Committers: 1

-   Valentine ([@pshoniuk](https://github.com/pshoniuk))

## @giphy/js-components@5.7.2 (2022-07-13)

#### refactor

-   `components`, `react-components`
    -   [#306](https://github.com/Giphy/giphy-js/pull/306) build(deps): update react, emotion, typescript & storybook ([@pshoniuk](https://github.com/pshoniuk))

#### Committers: 1

-   Valentine ([@pshoniuk](https://github.com/pshoniuk))

## @giphy/react-components@5.6.1 (2022-03-02)

#### bug

-   `components`, `react-components`
    -   [#281](https://github.com/Giphy/giphy-js/pull/281) Fix - WebP Loading Bug ([@giannif](https://github.com/giannif))

#### Committers: 1

-   Gianni Ferullo ([@giannif](https://github.com/giannif))

## @giphy/react-components@5.6.0 (2022-03-01)

#### feature

-   `components`, `react-components`
    -   [#280](https://github.com/Giphy/giphy-js/pull/280) feat(gif) Add keypress to GIF Events ([@pshoniuk](https://github.com/pshoniuk))
    -   [#279](https://github.com/Giphy/giphy-js/pull/279) feat(gif) Add keypress to GIF Events ([@robertpin](https://github.com/robertpin))

#### Committers: 2

-   Robert Pintilii ([@robertpin](https://github.com/robertpin))
-   Valentine ([@pshoniuk](https://github.com/pshoniuk))

## @giphy/react-components@5.5.0 (2022-02-23)

#### feature

-   `components`, `react-components`
    -   [#276](https://github.com/Giphy/giphy-js/pull/276) feat(carousel): add a gifWidth option for fixed width carousel items ([@giannif](https://github.com/giannif))

#### Committers: 2

-   Gianni Ferullo ([@giannif](https://github.com/giannif))
-   Valentine ([@pshoniuk](https://github.com/pshoniuk))

## @giphy/react-components@5.3.0 (2021-09-09)

#### feature

-   `react-components`
    -   [#264](https://github.com/Giphy/giphy-js/pull/264) feat(video/overlay): add an overlay for the video player component ([@giannif](https://github.com/giannif))

#### Committers: 1

-   Gianni Ferullo ([@giannif](https://github.com/giannif))

## @giphy/react-components@5.2.0 (2021-09-07)

#### feature

-   `react-components`
    -   [#261](https://github.com/Giphy/giphy-js/pull/261) feat(video): GIPHY CLIPS links to clip ([@giannif](https://github.com/giannif))
-   `react-components`, `types`
    -   [#260](https://github.com/Giphy/giphy-js/pull/260) Feat/video cc support ([@giannif](https://github.com/giannif))

#### Committers: 1

-   Gianni Ferullo ([@giannif](https://github.com/giannif))

## @giphy/react-components@5.1.0 (2021-08-30)

#### feature

-   `react-components`
    -   [#255](https://github.com/Giphy/giphy-js/pull/255) feat(video): auto hide controls ([@giannif](https://github.com/giannif))

#### Committers: 1

-   Gianni Ferullo ([@giannif](https://github.com/giannif))

## 5.0.0 (2021-08-25)

#### refactor

-   `react-components`
    -   [#253](https://github.com/Giphy/giphy-js/pull/253) redesign(video): react ui redesign ([@giannif](https://github.com/giannif))
    -   [#251](https://github.com/Giphy/giphy-js/pull/251) refactor(attribution): separate components ([@giannif](https://github.com/giannif))

#### Committers: 2

-   Gianni Ferullo ([@giannif](https://github.com/giannif))
-   Riko Fauzan Habib ([@fauzanrh](https://github.com/fauzanrh))

## 4.0.1 (2021-08-09)

#### refactor

-   `components`, `react-components`, `util`
    -   [#249](https://github.com/Giphy/giphy-js/pull/249) refactor: remove unused tracking pixel and dompurify ([@giannif](https://github.com/giannif))
-   `fetch-api`
    -   [#245](https://github.com/Giphy/giphy-js/pull/245) fix(fetch-api): fix warning circular dependencies (#244) ([@huynguyen93](https://github.com/huynguyen93))

#### build tools & continuous integration

-   `components`, `react-components`, `types`, `util`
    -   [#246](https://github.com/Giphy/giphy-js/pull/246) Build/dependency cruiser ([@giannif](https://github.com/giannif))

#### Committers: 2

-   Gianni Ferullo ([@giannif](https://github.com/giannif))
-   Huy ([@huynguyen93](https://github.com/huynguyen93))

## 4.0.0 (2021-08-03)

The search experience now loads trending by default if there is no search term, if you want to disable this feature use `shouldDefaultToTrending={false}` on the [SearchContextManager](https://github.com/Giphy/giphy-js/blob/master/packages/react-components/README.md#searchcontextmanager)

#### :rocket: Enhancement

-   `react-components`
    -   [#242](https://github.com/Giphy/giphy-js/pull/242) Feat/search experience defaults to trending ([@giannif](https://github.com/giannif))
    -   [#243](https://github.com/Giphy/giphy-js/pull/243) feat(react-components): custom loader for grid ([@giannif](https://github.com/giannif))

#### Committers: 1

-   Gianni Ferullo ([@giannif](https://github.com/giannif))

## 3.2.4 (2021-07-26)

#### :rocket: Enhancement

-   `react-components`
    -   [#239](https://github.com/Giphy/giphy-js/pull/239) Change the loop counter approach to use the onended event and play, instead of the loop property of the video element

([@giannif](https://github.com/giannif))

## 3.2.0 (2021-07-08)

#### :rocket: Enhancement

-   `react-components`
    -   [#231](https://github.com/Giphy/giphy-js/pull/231) Feat/video player controls - progress bar and more options ([@giannif](https://github.com/giannif))

#### Committers: 1

-   Gianni Ferullo ([@giannif](https://github.com/giannif))

## 3.1.0 (2021-07-07)

#### :rocket: Enhancement

-   `react-components`
    -   [#222](https://github.com/Giphy/giphy-js/pull/222) Feat/video player controls ([@giannif](https://github.com/giannif))
    -   [#224](https://github.com/Giphy/giphy-js/pull/224) react 17 peer dep / storybook upgrade ([@giannif](https://github.com/giannif))

## 3.0.0 (2021-05-19)

#### :rocket: Enhancement

-   `analytics`, `components`, `fetch-api`, `react-components`
    -   [#189](https://github.com/Giphy/giphy-js/pull/189) Feat/video updates ([@giannif](https://github.com/giannif))
-   `types`, `util`
    -   [#195](https://github.com/Giphy/giphy-js/pull/195) types(gif): text ([@giannif](https://github.com/giannif))

#### :bug: Bug Fix

-   `types`
    -   [#185](https://github.com/Giphy/giphy-js/pull/185) feat/primary-site-field-optional ([@kylebcarlson](https://github.com/kylebcarlson))

#### Committers: 2

-   Gianni Ferullo ([@giannif](https://github.com/giannif))
-   Kyle Carlson ([@kylebcarlson](https://github.com/kylebcarlson))

## 2.4.0 (2021-04-14)

#### :rocket: Enhancement

-   `analytics`
    -   [#181](https://github.com/Giphy/giphy-js/pull/181) feat(analytics): fire pingbacks on beforeunload ([@giannif](https://github.com/giannif))
-   `react-components`
    -   [#180](https://github.com/Giphy/giphy-js/pull/180) video ([@giannif](https://github.com/giannif))
-   `components`, `react-components`
    -   [#175](https://github.com/Giphy/giphy-js/pull/175) feat(components/react-components): add tabindex to gif, grid, and carousel ([@giannif](https://github.com/giannif))

## 2.2.0 (2021-02-11)

#### :rocket: Enhancement

-   `react-components`
    -   [#158](https://github.com/Giphy/giphy-js/pull/158) feat(react-components): prefetch / input font family / input auto focus ([@giannif](https://github.com/giannif))
-   `components`, `react-components`
    -   [#159](https://github.com/Giphy/giphy-js/pull/159) feat(components/react-components): on loaded classname ([@giannif](https://github.com/giannif))

#### Committers: 1

-   Gianni Ferullo ([@giannif](https://github.com/giannif))

## @giphy/react-components@2.1.3 (2021-01-29)

#### :rocket: Enhancement

-   `analytics`, `fetch-api`, `react-components`, `util`
    -   [#156](https://github.com/Giphy/giphy-js/pull/156) use session storage instead of cookie for pingback v2 ([@giannif](https://github.com/giannif))

#### Committers: 1

-   Gianni Ferullo ([@giannif](https://github.com/giannif))

## @giphy/react-components@2.1.2 (2021-01-27)

#### :rocket: Enhancement

-   `analytics`
    -   [#154](https://github.com/Giphy/giphy-js/pull/154) Get the environment url from globals ([@dleitee](https://github.com/dleitee))

#### Committers: 1

-   Daniel Leite de Oliveira ([@dleitee](https://github.com/dleitee))

## @giphy/react-components@2.1.0 (2021-01-05)

#### :rocket: Enhancement

-   `components`, `react-components`
    -   [#150](https://github.com/Giphy/giphy-js/pull/150) feat(react-components): border radius ([@giannif](https://github.com/giannif))

#### Committers: 1

-   Gianni Ferullo ([@giannif](https://github.com/giannif))

## @giphy/react-components@2.0.1 (2020-12-09)

#### :rocket: Enhancement

-   `react-components`
    -   [#142](https://github.com/Giphy/giphy-js/pull/142) condensed mode option for search bar experience ([@giannif](https://github.com/giannif))
    -   [#140](https://github.com/Giphy/giphy-js/pull/140) pingback v2 - analytics upgrade ([@giannif](https://github.com/giannif))

#### Committers: 1

-   Gianni Ferullo ([@giannif](https://github.com/giannif))

## @giphy/react-components@1.7.1 (2020-09-02)

#### :rocket: Enhancement

-   `react-components`
    -   [#129](https://github.com/Giphy/giphy-js/pull/129) new search experience with search bar and suggestion bar ([@giannif](https://github.com/giannif))

#### Committers: 1

-   Gianni Ferullo ([@giannif](https://github.com/giannif))

## @giphy/react-components@1.6.0 (2020-08-06)

#### :rocket: Enhancement

-   `components`, `react-components`
    -   [#119](https://github.com/Giphy/giphy-js/pull/119) feat(no-link): grid and carousel components accept the noLink prop ([@giannif](https://github.com/giannif))

## @giphy/react-components@1.5.1 (2020-07-09)

#### :bug: Bug Fix

-   `react-components`
    -   [#105](https://github.com/Giphy/giphy-js/pull/105) fix(react-components): column offsets in masonry ([@giannif](https://github.com/giannif))

## @giphy/react-components@1.5.0 (2020-07-08)

#### :rocket: Enhancement

-   `components`, `react-components`
    -   [#104](https://github.com/Giphy/giphy-js/pull/104) Redesign attribution component ([@giannif](https://github.com/giannif))

## @giphy/react-components@1.4.0 (2020-07-02)

#### :rocket: Enhancement

-   `react-components`
    -   [#102](https://github.com/Giphy/giphy-js/pull/102) feat(react-components): grid column offsets from top ([@giannif](https://github.com/giannif))

## @giphy/react-components@1.3.0 (2020-07-02)

#### :rocket: Enhancement

-   `react-components`
    -   [#100](https://github.com/Giphy/giphy-js/pull/100) feat(react-components): rewrite masonry in React (was bricks.js) to support SSR in Grid ([@giannif](https://github.com/giannif))

## @giphy/react-components@1.2.0 (2020-06-29)

#### :rocket: Enhancement

-   `react-components`
    -   [#98](https://github.com/Giphy/giphy-js/pull/100) feat(react-components): SSR support for GIF component / remove moat / use picture for webp detection ([@giannif](https://github.com/giannif))

## @giphy/react-components@1.1.0 (2020-06-17)

#### :rocket: Enhancement

-   `components`, `react-components`
    -   [#91](https://github.com/Giphy/giphy-js/pull/91) feature: add no result props when response is empty ([@JeffersonFilho](https://github.com/JeffersonFilho))

#### :bug: Bug Fix

-   `components`, `react-components`
    -   [#95](https://github.com/Giphy/giphy-js/pull/95) fix Preact grid and no results showing between searches, remove default no results (give devs a chance to use the new feature if they've implemented their own version) ([@giannif](https://github.com/giannif))

## @giphy/react-components@1.0.7 (2020-05-07)

#### :bug: Bug Fix

-   `react-components`
    -   [#87](https://github.com/Giphy/giphy-js/pull/87) fix(react-components): no set state after unmount to prevent endless … ([@giannif](https://github.com/giannif))

## @giphy/react-components@1.0.6 (2020-05-05)

#### :bug: Bug Fix

-   `react-components`
    -   [#86](https://github.com/Giphy/giphy-js/pull/86) fix(carousel): infinite scroll fetching ([@giannif](https://github.com/giannif))

## @giphy/react-components@1.0.4 (2020-04-23)

#### :rocket: Enhancement

-   `util`
    -   [#79](https://github.com/Giphy/giphy-js/pull/79) feat(rendition): select lower quality by raising max scale up pixels ([@giannif](https://github.com/giannif))

#### :bug: Bug Fix

-   `react-components`
    -   [#81](https://github.com/Giphy/giphy-js/pull/81) fix(react-grid): offscreen fetching ([@giannif](https://github.com/giannif))
