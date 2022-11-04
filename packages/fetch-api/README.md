# @giphy/js-fetch-api

Javascript API to fetch gifs and stickers from the GIPHY API.

Get started with your own api key: https://developers.giphy.com/docs/

```typescript
import { GiphyFetch } from '@giphy/js-fetch-api'

const gf = new GiphyFetch('your api key')

// fetch 10 gifs
const { data: gifs } = await gf.trending({ limit: 10 })
```

## Try it out:

[![Edit @giphy/js-fetch-api](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/20kmp3zp9r?fontsize=14)

# Fetch GIFs, Stickers, and Animated Text

## _search_

Search all Giphy GIFs for a word or phrase. Punctuation will be stripped and ignored.

##### Signature:

```typescript
search(term: string, options?: SearchOptions): Promise<GifsResult>
```

##### Search Options:

| option | type   | description                                     | default |
| :----- | :----- | :---------------------------------------------- | :-----: |
| _lang_ | string | See list of supported languages [here][lang].   |   en    |
| _sort_ | number | Specifies the starting position of the results. | recent  |

> Other Options: [Type Option](#type-option), [Rating Option](#rating-option), [Pagination Options](#pagination-options)

##### Example:

```typescript
const { data: gifs } = await gf.search('dogs', { sort: 'relevant', lang: 'es', limit: 10, type: 'stickers' })
```

## _trending_

Fetch GIFs currently trending online. Hand curated by the Giphy editorial team. The data returned mirrors the GIFs showcased on the Giphy homepage.

##### Signature:

```typescript
trending(options?: TrendingOptions): Promise<GifsResult>
```

> Trending Options: [Type Option](#type-option), [Rating Option](#rating-option), [Pagination Options](#pagination-options)

##### Example:

```typescript
const { data: gifs } = await gf.trending({ limit: 10, offset: 25, rating: 'g' })
```

## _gif by id_

Fetch a gif by id

##### Signature:

```typescript
gif(id: string): Promise<GifResult>
```

##### Example:

```typescript
const { data: gif } = await gf.gif('3oEjHGr1Fhz0kyv8Ig')
```

## _gifs by ids, or category and subcategory_

##### Signature:

```typescript
// by id
gifs(ids: string[]): Promise<GifsResult>
// by category and subcategory
gifs(category: string, subcategory: string): Promise<GifsResult>
```

##### Example:

```typescript
// by id
const { data: gifs } = await gf.gifs(['3oEjHGr1Fhz0kyv8Ig'])
// by category and subcategory
const { data: gifs } = await gf.gifs('tv', 'arrested-development')
```

## _animate_

Create animated text gifs dynamicaly based on the text input. This endpoint will require you to [create a new SDK key](https://developers.giphy.com/dashboard/)

##### Signature:

```typescript
animate(text: string, options?: PaginationOptions): Promise<GifsResult>
```

> Options: [Pagination Options](#pagination-options)

##### Example:

```typescript
const { data: gifs } = await gf.animate('some text to animate!', { limit: 5 })
```

## _related_

Fetch related gifs based on the id of a gif

##### Signature:

```typescript
related(id: string, options?: RelatedOptions): Promise<GifsResult>
```

> Options: [Pagination Options](#pagination-options), [Type Option](#type-option)

##### Example:

```typescript
const { data: gifs } = await gf.related('3oEjHGr1Fhz0kyv8Ig', { limit: 10 })
```

## _emoji_

Fetch emoji. Emoji are stickers from a currated channel. There's no search or trending emoji.

##### Signature:

```typescript
emoji(options?: PaginationOptions): Promise<GifsResult>
```

> Emoji Options: [Pagination Options](#pagination-options)

##### Example:

```typescript
const { data: gifs } = await gf.emoji()
```

## _emoji default variations_

Returns a list of all the default emoji variations.

##### Signature:

```typescript
emojiDefaultVariations(options?: PaginationOptions): Promise<GifsResult>
```

> Options: [Pagination Options](#pagination-options)

##### Example:

```typescript
const { data: gifs } = await gf.emojiDefaultVariations()
```

## _emoji variations_

Returns a list of gifs representing all the variations for the emoji.

##### Signature:

```typescript
emojiVariations(id: GifID): Promise<NonPaginatedGifsResult>
```

##### Example:

```typescript
const { data: gifs } = await gf.emojiVariations('iigp4VDyf5dCLRlGkm')
```

## _random_

Returns a random single GIF

##### Signature:

```typescript
random(options?: RandomOptions): Promise<GifResult>
```

##### Random Options:

| option | type   | description                         |  default  |
| :----- | :----- | :---------------------------------- | :-------: |
| _tag_  | string | The GIF tag to limit randomness by. | undefined |

> Options: [Type Option](#type-option)

##### Example:

```typescript
const { data: gif } = await gf.random({ tag: 'beer', type: 'stickers' })
```

# Fetch Categories and Subcategories

## _categories_

```typescript
categories(options?: CategoriesOptions): Promise<CategoriesResult>
```

```typescript
const { data: categories } = await gf.categories()
categories.forEach((category) => {
    console.log(category) // ICategory
})
```

Options: [Pagination Options](#pagination-options)

## _subcategories_

```typescript
subcategories(category: string, options?: SubcategoriesOptions): Promise<CategoriesResult>
```

```typescript
// Example:
const { data: categories } = await gf.subcategories('tv', { limit: 10, offset: 25, rating: 'g' })
categories.forEach((category) => {
    console.log(category) // ICategory
})
```

Options: [Pagination Options](#pagination-options)

# Shared Options

### Pagination Options

| option   | type   | description                                     | default |
| :------- | :----- | :---------------------------------------------- | :-----: |
| _limit_  | number | Number of results to return, maximum 100        |   25    |
| _offset_ | number | Specifies the starting position of the results. |    0    |

### Rating Option

| option   | type   | description                                    | default |
| :------- | :----- | :--------------------------------------------- | :-----: |
| _rating_ | string | limit results by rating: _y, g, pg, pg-13, r_. |    g    |

### Type Option

| option | type   | description                     | default |
| :----- | :----- | :------------------------------ | :-----: |
| _type_ | string | gifs / stickers / text / videos |  gifs   |

[lang]: https://developers.giphy.com/docs/#language-support
