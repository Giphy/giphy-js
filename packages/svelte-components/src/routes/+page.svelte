<script lang="ts">
    import type { GifResult } from '@giphy/js-fetch-api'
    import Loader from '../lib/Loader.svelte'
    import { Gif } from '../lib/index.js'
    /** @type {import('./$types').PageData} */
    export let data: GifResult
</script>

<Gif
    gif={data.data}
    width={300}
    onGifClick={(gif) => {
        console.log('clicked', gif.id)
    }}
/>

<Loader />
