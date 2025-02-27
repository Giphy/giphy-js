## 4.4.2

## 5.2.0

### Minor Changes

-   1125e6e: fix bottle data injection and replace magic tags

## 5.1.0

### Minor Changes

-   94158d9: - moat tracking in react components
    -   remove unused deps in util
    -   append bottle data in fetch-api
    -   update types for gif to include bottle_data

### Patch Changes

-   Updated dependencies [94158d9]
    -   @giphy/js-types@5.1.0

## 5.0.0

### Major Changes

-   9914802: util, analytics, fetch-api and brand are all type: module now. See [here](https://github.com/Giphy/giphy-js/pull/391#issue-1770394467) for more info

    ## Possible breaking change

    The output format has changed. If you are accessing files in dist, your build will fail.

### Patch Changes

-   8c8e8d6: Add types to package.json export field

## 4.4.1

### Patch Changes

-   9418497: dependency upgrades

#### refactor

-   `util`
    -   [#249](https://github.com/Giphy/giphy-js/pull/249) refactor: remove unused tracking pixel and injectTrackingPixel from exports

#### Committers: 2

-   Gianni Ferullo ([@giannif](https://github.com/giannif))

## 3.0.0 (2021-05-19)

#### :rocket: Enhancement

-   `analytics`, `components`, `fetch-api`, `react-components`
    -   [#189](https://github.com/Giphy/giphy-js/pull/189) Feat/video updates ([@giannif](https://github.com/giannif))
-   `types`, `util`
    -   [#195](https://github.com/Giphy/giphy-js/pull/195) types(gif): text ([@giannif](https://github.com/giannif))

#### :bug: Bug Fix

-   `types`
    -   [#185](https://github.com/Giphy/giphy-js/pull/185) feat/primary-site-field-optional ([@kylebcarlson](https://github.com/kylebcarlson))

## 2.3.0 (2021-04-14)

#### :bug: Bug Fix

-   [#173](https://github.com/Giphy/giphy-js/pull/173) fix(react-native): for the fetch-api, add checks for unsupported location and uuid ([@giannif](https://github.com/giannif))
