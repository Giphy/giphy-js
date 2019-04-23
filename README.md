## GIPHY-JS

Docs are a WIP

[lerna](https://github.com/lerna/lerna) repo containing our public javascript libs.

#### [@giphy/js-fetch-api](packages/fetch-api/README.md)

> fetch gifs, categories, and subcategories using the [GIPHY API](https://developers.giphy.com/docs/)

#### [@giphy/js-components](packages/components/README.md)

> lightweight grid with infinite scroll and lazyload, ad pill, attribution. no layout thrashing

#### [@giphy/js-types](packages/types/README.md)

> shared data types

#### [@giphy/js-util](packages/util/README.md)

> shared util

#### [@giphy/js-brand](packages/brand/README.md)

> colors, fonts

### Install

```sh
$ yarn && lerna bootstrap
```

### Dev

Some packages have

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

```sh
$ lerna version
```
