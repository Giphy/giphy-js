# @giphy/svelte-components (BETA)

> Note this project is in beta and may contain bugs. PRs are welcome! as are issues with suggestions and bug reports

This package provides components that help you display gifs on a website. It works in tandem with [@giphy/js-fetch-api](../fetch-api/) and [@giphy/js-types](../types) packages

There are three main components: Gif, Grid, and Carousel described below. Feel free to poke around the `src/routes` dir for working examples

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

-   showLink: use an href and an a tag to show
-   height: you can hard-code a height and the image will scale based on the object-fit (default `cover`)
-   on:click: handle the gif click in your application
-   hideAttribution: hide the default attribution overlay (using a custom overlay also hides this)

## Layout Components - Grid and Carousel

```svelte
<Grid
    initialGifs={gifs}
    on:click={(e) => {
        // do something with the gif
        console.log(`on:click gif:`, e.detail.gif)
    }}
    width={600}
    fetchGifs={(offset) => gf.trending({ offset })}
    gifProps={{ borderRadius: 0 }}
/>

<Carousel initialGifs={gifs} gifHeight={100} fetchGifs={(offset) => gf.trending({ offset })} />
```

Grid/Carousel props:

-   initialGifs: if you're doing SSR you'll want to populate the grid before a fetch is triggered
-   fetchGifs: if there are no initialGifs this will fire immediately upon mount. It will fire subsequently as you scroll.
-   gifProps: these are forwarded to the gif component in the grid/carousel

### Refreshing Layout Components

Refresh the grid based on a search term

```svelte
<script lang="ts">
    import { Grid } from '@giphy/svelte-components'
    import { GiphyFetch } from '@giphy/js-fetch-api'
    import type { PageData } from './$types.js'
    const gf = new GiphyFetch('sXpGFDGZs0Dv1mmNFvYaGUvYwKX0PWIh')
    export let data: PageData
    let term = data.term // the initial term on page load
    let initialGifs = data.gifs // the initial gifs for ssr
</script>

<p>
    Search for gifs:
    <input bind:value={term} />
</p>
<!-- use the term as a key to reset the Grid-->
{#key term}
    <Grid
        initialGifs={data.term === term ? initialGifs : []}
        on:click={(e) => {
            console.log(`on:click gif:`, e.detail.gif)
        }}
        width={600}
        fetchGifs={(offset) => gf.search(term, { offset, limit: 10 })}
        gifProps={{ borderRadius: 0 }}
    />
{/key}
```
