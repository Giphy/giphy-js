<script lang="ts">
    import { GiphyFetch, type GifsResult } from '@giphy/js-fetch-api'
    import { Grid } from '../../lib/index.js'
    const gf = new GiphyFetch('sXpGFDGZs0Dv1mmNFvYaGUvYwKX0PWIh')
    const limit = 10
    /** @type {import('./$types').PageData} */
    export let data: GifsResult
</script>

<Grid initialGifs={data.data} width={600} fetchGifs={(offset) => gf.trending({ offset, limit })} />
