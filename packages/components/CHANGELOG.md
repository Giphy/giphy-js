## @giphy/js-components@5.4.1 (2022-03-02)

## 5.12.1

### Patch Changes

-   9418497: dependency upgrades
-   Updated dependencies [9418497]
    -   @giphy/js-analytics@4.3.1
    -   @giphy/js-fetch-api@4.9.1
    -   @giphy/js-brand@2.3.1
    -   @giphy/js-util@4.4.1

#### bug

-   `components`, `react-components`
    -   [#281](https://github.com/Giphy/giphy-js/pull/281) Fix - WebP Loading Bug ([@giannif](https://github.com/giannif))

#### Committers: 1

-   Gianni Ferullo ([@giannif](https://github.com/giannif))

## @giphy/js-components@5.4.0 (2022-03-01)

#### feature

-   `components`, `react-components`
    -   [#280](https://github.com/Giphy/giphy-js/pull/280) feat(gif) Add keypress to GIF Events ([@pshoniuk](https://github.com/pshoniuk))
    -   [#279](https://github.com/Giphy/giphy-js/pull/279) feat(gif) Add keypress to GIF Events ([@robertpin](https://github.com/robertpin))

#### Committers: 2

-   Robert Pintilii ([@robertpin](https://github.com/robertpin))
-   Valentine ([@pshoniuk](https://github.com/pshoniuk))

## @giphy/js-components@5.3.0 (2022-02-23)

#### feature

-   `components`, `react-components`
    -   [#276](https://github.com/Giphy/giphy-js/pull/276) feat(carousel): add a gifWidth option for fixed width carousel items ([@giannif](https://github.com/giannif))

#### Committers: 2

-   Gianni Ferullo ([@giannif](https://github.com/giannif))
-   Valentine ([@pshoniuk](https://github.com/pshoniuk))

## @giphy/js-components@5.2.0 (2021-10-21)

#### build tools & continuous integration

-   [#269](https://github.com/Giphy/giphy-js/pull/269) ci: update the license checker tool ([@pshoniuk](https://github.com/pshoniuk))

#### Committers: 3

-   Francesco Vasco ([@fvasco](https://github.com/fvasco))
-   Gianni Ferullo ([@giannif](https://github.com/giannif))
-   Valentine ([@pshoniuk](https://github.com/pshoniuk))

## @giphy/js-components@5.1.6 (2021-09-07)

#### feature

-   `react-components`
    -   [#261](https://github.com/Giphy/giphy-js/pull/261) feat(video): GIPHY CLIPS links to clip ([@giannif](https://github.com/giannif))
-   `react-components`, `types`
    -   [#260](https://github.com/Giphy/giphy-js/pull/260) Feat/video cc support ([@giannif](https://github.com/giannif))

#### Committers: 1

-   Gianni Ferullo ([@giannif](https://github.com/giannif))

## 5.1.5 (2021-08-09)

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

## 5.1.3 (2021-07-26)

#### :rocket: Enhancement

-   `components`
    -   [#239](https://github.com/Giphy/giphy-js/pull/239) Change the loop counter approach to use the onended event and play, instead of the loop property of the video element

## 5.0.0 (2021-05-19)

#### :rocket: Enhancement

-   `analytics`, `components`, `fetch-api`, `react-components`
    -   [#189](https://github.com/Giphy/giphy-js/pull/189) Feat/video updates ([@giannif](https://github.com/giannif))
-   `types`, `util`
    -   [#195](https://github.com/Giphy/giphy-js/pull/195) types(gif): text ([@giannif](https://github.com/giannif))

#### :bug: Bug Fix

-   `types`
    -   [#185](https://github.com/Giphy/giphy-js/pull/185) feat/primary-site-field-optional ([@kylebcarlson](https://github.com/kylebcarlson))

## 4.4.0 (2021-04-14)

#### :rocket: Enhancement

-   `analytics`
    -   [#181](https://github.com/Giphy/giphy-js/pull/181) feat(analytics): fire pingbacks on beforeunload ([@giannif](https://github.com/giannif))
-   `react-components`
    -   [#180](https://github.com/Giphy/giphy-js/pull/180) video ([@giannif](https://github.com/giannif))
-   `components`, `react-components`
    -   [#175](https://github.com/Giphy/giphy-js/pull/175) feat(components/react-components): add tabindex to gif, grid, and carousel ([@giannif](https://github.com/giannif))

## 4.2.0 (2021-02-11)

#### :rocket: Enhancement

-   `components`, `react-components`
    -   [#159](https://github.com/Giphy/giphy-js/pull/159) feat(components/react-components): on loaded classname ([@giannif](https://github.com/giannif))

#### Committers: 1

-   Gianni Ferullo ([@giannif](https://github.com/giannif))

## @giphy/js-components@4.1.3 (2021-01-29)

#### :rocket: Enhancement

-   `analytics`, `fetch-api`, `react-components`, `util`
    -   [#156](https://github.com/Giphy/giphy-js/pull/156) use session storage instead of cookie for pingback v2 ([@giannif](https://github.com/giannif))

#### Committers: 1

-   Gianni Ferullo ([@giannif](https://github.com/giannif))

## @giphy/js-components@4.1.2 (2021-01-27)

#### :rocket: Enhancement

-   `analytics`
    -   [#154](https://github.com/Giphy/giphy-js/pull/154) Get the environment url from globals ([@dleitee](https://github.com/dleitee))

#### Committers: 1

-   Daniel Leite de Oliveira ([@dleitee](https://github.com/dleitee))

## @giphy/js-components@4.1.0 (2021-01-05)

#### :rocket: Enhancement

-   `components`, `react-components`
    -   [#150](https://github.com/Giphy/giphy-js/pull/150) feat(react-components): border radius ([@giannif](https://github.com/giannif))

#### Committers: 1

-   Gianni Ferullo ([@giannif](https://github.com/giannif))

## @giphy/js-components@4.0.1 (2020-12-09)

#### :rocket: Enhancement

-   `js-components`
    -   [#140](https://github.com/Giphy/giphy-js/pull/140) pingback v2 - analytics upgrade ([@giannif](https://github.com/giannif))

#### Committers: 1

-   Gianni Ferullo ([@giannif](https://github.com/giannif))

## @giphy/js-components@3.4.0 (2020-08-06)

#### :rocket: Enhancement

-   `components`, `react-components`
    -   [#119](https://github.com/Giphy/giphy-js/pull/119) feat(no-link): grid and carousel components accept the noLink prop ([@giannif](https://github.com/giannif))

## @giphy/js-components@3.3.0 (2020-07-08)

#### :rocket: Enhancement

-   `components`, `react-components`
    -   [#104](https://github.com/Giphy/giphy-js/pull/104) Redesign attribution component ([@giannif](https://github.com/giannif))

## @giphy/js-components@3.1.0 (2020-06-17)

#### :rocket: Enhancement

-   `components`, `react-components`
    -   [#91](https://github.com/Giphy/giphy-js/pull/91) feature: add no result props when response is empty ([@JeffersonFilho](https://github.com/JeffersonFilho))

#### :bug: Bug Fix

-   `components`, `react-components`
    -   [#95](https://github.com/Giphy/giphy-js/pull/95) fix Preact grid and no results showing between searches, remove default no results (give devs a chance to use the new feature if they've implemented their own version) ([@giannif](https://github.com/giannif))

## @giphy/js-components@3.0.4 (2020-04-23)

#### :rocket: Enhancement

-   `util`
    -   [#79](https://github.com/Giphy/giphy-js/pull/79) feat(rendition): select lower quality by raising max scale up pixels ([@giannif](https://github.com/giannif))
