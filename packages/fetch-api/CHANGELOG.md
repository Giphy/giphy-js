## 4.1.1 (2021-08-09)

## 5.7.0

### Minor Changes

-   39fdc51: add a workaround for channels with hidden gifs

### Patch Changes

-   5f3ea10: hidden gifs workarounds: tweak the logic for knowing when to fetch more gifs

## 5.6.0

### Minor Changes

-   7dd9a5b: Handle geo-blocked response from API

## 5.5.0

### Minor Changes

-   94158d9: - moat tracking in react components
    -   remove unused deps in util
    -   append bottle data in fetch-api
    -   update types for gif to include bottle_data

### Patch Changes

-   Updated dependencies [94158d9]
    -   @giphy/js-types@5.1.0
    -   @giphy/js-util@5.1.0

## 5.4.0

### Minor Changes

-   3b5e333: remove qs library, use URLSearchParams

## 5.3.0

### Minor Changes

-   357c1b9: fetch-api: internal option for extra gif metadata

## 5.2.0

### Minor Changes

-   bb4b82c: add optional qs params argument to GiphyFetch constructor

    Any params passed here will be apppened to all requests

## 5.1.0

### Minor Changes

-   ad0f108: react-components: percentWidth prop on gif allows you to display a Gif component using a css percentage value

    fetch-api: add type videos to related end point

## 5.0.0

### Major Changes

-   9914802: util, analytics, fetch-api and brand are all type: module now. See [here](https://github.com/Giphy/giphy-js/pull/391#issue-1770394467) for more info

    ## Possible breaking change

    The output format has changed. If you are accessing files in dist, your build will fail.

### Patch Changes

-   Updated dependencies [9914802]
    -   @giphy/js-util@5.0.0

## 4.9.3

-   8ddfb8c: check for require so esm build doesn't fail

## 4.9.2

### Patch Changes

-   8c8e8d6: Add types to package.json export field
-   Updated dependencies [8c8e8d6]
    -   @giphy/js-util@4.4.2

## 4.9.1

### Patch Changes

-   9418497: dependency upgrades
-   Updated dependencies [9418497]
    -   @giphy/js-util@4.4.1

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

## 4.0.0 (2021-05-19)

#### :rocket: Enhancement

-   `analytics`, `components`, `fetch-api`, `react-components`
    -   [#189](https://github.com/Giphy/giphy-js/pull/189) Feat/video updates ([@giannif](https://github.com/giannif))
-   `types`, `util`
    -   [#195](https://github.com/Giphy/giphy-js/pull/195) types(gif): text ([@giannif](https://github.com/giannif))

#### :bug: Bug Fix

-   `types`
    -   [#185](https://github.com/Giphy/giphy-js/pull/185) feat/primary-site-field-optional ([@kylebcarlson](https://github.com/kylebcarlson))

## 3.0.0 (2021-04-14)

#### :bug: Bug Fix

-   `fetch-api`
    -   [#179](https://github.com/Giphy/giphy-js/pull/179) fix(fetch-api): normalize api response ([@giannif](https://github.com/giannif))

## 2.2.0 (2021-02-11)

#### :rocket: Enhancement

-   `fetch-api`
    -   [#160](https://github.com/Giphy/giphy-js/pull/160) feat(fetch-api): expire error fetches more quickly ([@giannif](https://github.com/giannif))

## 2.1.0 (2021-01-29)

#### :rocket: Enhancement

-   `fetch-api`
    -   [#156](https://github.com/Giphy/giphy-js/pull/156) use session storage instead of cookie for pingback v2 ([@giannif](https://github.com/giannif))

#### Committers: 1

-   Gianni Ferullo ([@giannif](https://github.com/giannif))

## 2.0.1 (2020-12-09)

#### :rocket: Enhancement

-   `fetch-api`
    -   [#143](https://github.com/Giphy/giphy-js/pull/143) related stickers option ([@giannif](https://github.com/giannif))
    -   [#141](https://github.com/Giphy/giphy-js/pull/141) global api url override ([@giannif](https://github.com/giannif))

#### Committers: 1

-   Gianni Ferullo ([@giannif](https://github.com/giannif))

## 1.7.0 (2020-09-28)

#### :rocket: Enhancement

-   `fetch-api`
    -   [#134](https://github.com/Giphy/giphy-js/pull/134) feat(fetch-api): keep requests fresh ([@giannif](https://github.com/giannif))

#### :bug: Bug Fix

-   `fetch-api`
    -   [#136](https://github.com/Giphy/giphy-js/pull/136) Wrong type for subcategories ([@jravas](https://github.com/jravas))

#### Committers: 3

-   Gianni Ferullo ([@giannif](https://github.com/giannif))
-   Josip Ravas ([@jravas](https://github.com/jravas))
-   Nick S ([@nicksantan](https://github.com/nicksantan))

## 1.6.1 (2020-08-03)

#### :bug: Bug Fix

-   `fetch-api`
    -   [#118](https://github.com/Giphy/giphy-js/pull/118) fix(fetch-api): don't cache random requests in memory ([@giannif](https://github.com/giannif))

#### Committers: 1

-   Gianni Ferullo ([@giannif](https://github.com/giannif))
