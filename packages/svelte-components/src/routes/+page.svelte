<script lang="ts">
    import type { GifResult } from '@giphy/js-fetch-api'
    import Attribution from '../lib/Attribution.svelte'
    import Loader from '../lib/Loader.svelte'
    import { Gif } from '../lib/index.js'
    /** @type {import('./$types').PageData} */
    export let data: GifResult
</script>

<h1>GIPHY Svelte Components</h1>

<a href="/grid">Grid</a>
<a href="/carousel">Carousel</a>
<h3>Default Gif</h3>
<Gif gif={data.data} width={300} />

<h3>Custom Overaly</h3>
<Gif
    gif={data.data}
    width={300}
    onGifClick={(_, gif) => {
        console.log('clicked', gif.id)
    }}
>
    <div slot="overlay" class="overlay" let:gif let:hovered>
        {#if hovered}
            <div>{gif.title}</div>
        {/if}
    </div>
</Gif>

<h3>Attribution</h3>
<Attribution gif={data.data} />

<h3>Loader</h3>
<Loader />

<style>
    .overlay {
        position: absolute;
        bottom: 8px;
        right: 8px;
        color: white;
        font-weight: 900;
    }
</style>
