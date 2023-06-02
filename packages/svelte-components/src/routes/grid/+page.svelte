<script lang="ts">
    import { GiphyFetch } from '@giphy/js-fetch-api'
    import { Grid } from '../../lib/index.js'
    const gf = new GiphyFetch('sXpGFDGZs0Dv1mmNFvYaGUvYwKX0PWIh')
    const req = gf.trending()
</script>

{#await req}
    <p>...waiting</p>
{:then result}
    <Grid initialGifs={result.data} width={600} />
{:catch error}
    <p style="color: red">{error.message}</p>
{/await}
