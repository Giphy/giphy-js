## GIPHY-JS

[![Build Status](https://travis-ci.com/Giphy/giphy-js.svg?token=jJjbVBEbrqabxuHRjdmS&branch=master)](https://travis-ci.com/Giphy/giphy-js)

[lerna](https://github.com/lerna/lerna) monorepo containing GIPHY's public javascript packages.

#### [@giphy/js-fetch-api](packages/fetch-api/README.md)

> fetch gifs, stickers, categories and more

#### [@giphy/js-components](packages/components/README.md)

> lightweight UI components

#### [@giphy/js-types](packages/types/README.md)

> shared data types

#### [@giphy/js-util](packages/util/README.md)

> shared js utils

#### [@giphy/js-brand](packages/brand/README.md)

> giphy brand colors and fonts

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

[Travis](https://travis-ci.com/Giphy/giphy-js) will publish to npm
