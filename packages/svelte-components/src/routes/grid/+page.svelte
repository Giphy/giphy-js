<script lang="ts">
    import { GiphyFetch } from '@giphy/js-fetch-api'
    import { Grid } from '../../lib/index.js'
    const gf = new GiphyFetch('sXpGFDGZs0Dv1mmNFvYaGUvYwKX0PWIh')
    const limit = 10
    const req = gf.trending({ offset: 0, limit })
</script>

{#await req}
    <p>...waiting</p>
{:then result}
    <Grid initialGifs={result.data} width={600} fetchGifs={(offset) => gf.trending({ offset, limit })} />
{:catch error}
    <p style="color: red">{error.message}</p>
{/await}
