<script lang="ts">
    import { GiphyFetch } from '@giphy/js-fetch-api'
    import Grid from '../../../lib/Grid.svelte'
    import type { PageData } from './$types.js'
    const gf = new GiphyFetch('sXpGFDGZs0Dv1mmNFvYaGUvYwKX0PWIh')
    export let data: PageData
    let term = data.term
    const initialGifs = data.gifs
    $: term
</script>

<p>
    Search for gifs:
    <input bind:value={term} />
</p>
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
