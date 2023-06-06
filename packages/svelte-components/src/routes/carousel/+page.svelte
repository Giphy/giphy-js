<script lang="ts">
    import { GiphyFetch, type GifsResult } from '@giphy/js-fetch-api'
    import Carousel from '../../lib/Carousel.svelte'
    const gf = new GiphyFetch('sXpGFDGZs0Dv1mmNFvYaGUvYwKX0PWIh')
    const limit = 10
    /** @type {import('./$types').PageData} */
    export let data: GifsResult
</script>

<h1>Carousel</h1>
<Carousel initialGifs={data.data} gifHeight={100} fetchGifs={(offset) => gf.trending({ offset, limit })} />

<h1>Fixed gif width</h1>
<Carousel
    initialGifs={data.data}
    gifHeight={100}
    gifWidth={100}
    fetchGifs={(offset) => gf.trending({ offset, limit })}
/>
