<script lang="ts">
    import type { GifResult } from '@giphy/js-fetch-api'
    import Loader from '../lib/Loader.svelte'
    import { Gif } from '../lib/index.js'
    /** @type {import('./$types').PageData} */
    export let data: GifResult
</script>

<h1>GIPHY Svelte Components</h1>
<h3>{data.data.title}</h3>
<Gif
    gif={data.data}
    width={300}
    onGifClick={(gif) => {
        console.log('clicked', gif.id)
    }}
/>

<h3>Loader</h3>
<Loader />
