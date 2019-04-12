## GIPHY-JS

Docs are a WIP

[lerna](https://github.com/lerna/lerna) repo containing our public javascript libs.

#### @giphy/js-fetch-api

> fetch gifs, categories, and subcategories using the [GIPHY API](https://developers.giphy.com/docs/)

#### @giphy/js-brand

> colors, fonts

#### @giphy/js-components

> lightweight grid with infinite scroll and lazyload, ad pill, attribution. no layout thrashing

#### @giphy/js-types

> shared data types

#### @giphy/js-util

> shared util

### Install

```sh
$ yarn && lerna bootstrap
```

### Dev

```sh
$ cd packages/components
$ yarn run dev
```

### Lint

From root of project:

```sh
$ yarn run lint
```

### Publishing

`.travis.yml` will publish npm packages WIP
