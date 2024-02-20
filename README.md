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

## A note about pingbacks

This SDK sends analytics events back to GIPHY in the form of pingbacks to help us improve the quality of search results for your users. You may want to consider advising your users of this in your app's privacy policy.

![Go do it](https://giphy.com/static/img/sdk/cat.gif)

## GIPHY-JS Developer Section

### Install

```sh
$ yarn
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

Publishing to npm will be done by the [changeset github action](https://github.com/changesets/action).

In your pr you will create a changeset by using the changest cli. Readmore [here](https://github.com/changesets/changesets)

```sh
$ yarn changeset
```

Follow the prompts to specify the semver and describe the changes you've made. This will create a changeset file which should be committed. Once you have your changeset ready and the PR is approved, you can merge your PR to master.

The github actions will run and create another PR based on your changeset. When this PR is approved and merged, the Publish github action will run and the packages will be published.

If you're not ready to publish your changeset, you don't have to merge the changeset PR
