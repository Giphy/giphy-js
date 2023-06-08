# @giphy/svelte-components (BETA)

> > > Note this project is in beta and may contain bugs. PRs are welcome! as are issues with suggestions and bug reports

This pacakge provides components that help you display gifs on a website. It works in tandom with [@giphy/js-fetch-api](../fetch-api/) and [@giphy/js-types](../types) packages

There are three main components:

## Gif

```svelte
<Gif {gif} width={300} />
```

The Gif component takes a [IGif](../types/src/gif.ts) object. You can use the [@giphy/js-fetch-api](../fetch-api/) to easily fetch data. Then pass the Gif to `result.data` to the gif component.
It is required to specify a `width` so the correct rendition is selected.

### Overlays

If you want to display something over the gif you can use a slot. You can use `position:absolute` to position it.

```svelte
<Gif {gif} width={300}>
    <div slot="overlay" class="overlay" let:gif let:hovered>
        {#if hovered}
            <div>{gif.title}</div>
        {/if}
    </div>
</Gif>
```

Other props:

-   noLink: don't use an href, helpful if the component is nested in another href
-   height: you can hard-code a height and the image will scale based on the object-fit (default `cover`)
-   onGifClick: handle the gif click in your application

## Developing

```bash
yarn run dev
```

Everything inside `src/lib` is part of your library, everything inside `src/routes` can be used as a showcase or preview app.

## Building

To build your library:

```bash
yarn run package
```

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
