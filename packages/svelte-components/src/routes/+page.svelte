<script lang="ts">
    import { GiphyFetch } from '@giphy/js-fetch-api'
    import Loader from '../lib/Loader.svelte'
    import { Gif } from '../lib/index.js'
    const gf = new GiphyFetch('sXpGFDGZs0Dv1mmNFvYaGUvYwKX0PWIh')
    const req = gf.gif('ZEU9ryYGZzttn0Cva7')
</script>

{#await req}
    <p>...waiting</p>
{:then result}
    <Gif
        gif={result.data}
        width={300}
        onGifClick={(gif) => {
            console.log('clicked', gif.id)
        }}
    />
{:catch error}
    <p style="color: red">{error.message}</p>
{/await}

<Loader />
