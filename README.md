![GIPHY for developers](https://giphy.com/static/img/sdk/header.gif)

The GIPHY SDKs let you and your users easily access the world’s largest GIF library anywhere on your website. Whether it’s via a comment, forum post, review, chatbot or messenger, adding GIFs to your product is a simple and easy way to boost engagement and user experience.

# GIPHY-JS SDKs

[![Build Status](https://travis-ci.com/Giphy/giphy-js.svg?token=jJjbVBEbrqabxuHRjdmS&branch=master)](https://travis-ci.com/Giphy/giphy-js)

Choose your flavor!

### [@giphy/react-components](packages/react-components/README.md)

> React components focused on ease-of-use and performance

### [@giphy/js-components](packages/components/README.md)

> lightweight UI components, no framework required

### [@giphy/js-fetch-api](packages/fetch-api/README.md)

> fetch gifs, stickers, categories and more (build your own UI, no SDK analytics)

## _Now go build something!_

![Go do it](https://giphy.com/static/img/sdk/cat.gif)

## GIPHY-JS Developer Section

### Install

Make sure your node and yarn versions are correct. You can do this with [volta](https://volta.sh/), a tool for managing global dependencies.

```sh
$ curl https://get.volta.sh | bash
```

```sh
$ yarn set version berry
$ yarn
```

### Dev

Some packages have a dev script. You can cd and run the command

```sh
$ cd packages/components
$ yarn run dev
```

or you can use `yarn workspace` commands

```sh
$ yarn workspace @giphy/react-components dev
```

### Lint

From root of project:

```sh
$ yarn run lint
```

### Test

From root of project:

```sh
$ yarn run test
```

### Publishing

Publishing to npm will be done by the [changeset github action](https://github.com/changesets/action).

In your pr you will create a changeset by using the changest cli. Readmore [here](https://github.com/changesets/changesets)

```sh
$ yarn changeset
```

Follow the prompts to specify the semver and describe the changes you've made. This will create a changeset file which should be committed. Once you have your changeset ready and the PR is approved, you can merge your PR to master.

The github actions will run and create another PR based on your changeset. When this PR is approved and merged, the Publish github action will run and the packages will be published.

If you're not ready to publish your changeset, you don't have to merge the changeset PR
