<script lang="ts">
    import { gifPaginator, type GifsResult } from '@giphy/js-fetch-api'
    import type { IGif } from '@giphy/js-types'
    import { getGifWidth } from '@giphy/js-util'
    import { onMount } from 'svelte'
    import { debounce } from 'throttle-debounce'
    import Gif from './Gif.svelte'

    // if we have gifs we can pass them in as initialGifs
    export let initialGifs: IGif[] = []
    // we'll fetch extra gifs when the loader is visible
    export let fetchGifs: (offset: number) => Promise<GifsResult>
    // loader config lets us trigger a fetch before the user reaches the bottom
    export let loaderConfig = { rootMargin: '0px 0px 250px 0px' }
    export let gifHeight = 100
    export let gifWidth: number | undefined = undefined

    let isLoaderVisible = false
    let isFetching = false

    const paginator = gifPaginator(fetchGifs, initialGifs)
    const doFetch = debounce(100, async () => {
        if (isLoaderVisible && !isFetching) {
            isFetching = true
            const gifs = await paginator()
            initialGifs = gifs
            isFetching = false
        }
    })

    // when these change fetch more gifs
    $: initialGifs, isLoaderVisible, isFetching, doFetch()

    let loader: HTMLDivElement
    onMount(() => {
        const i = new IntersectionObserver(([entry]: IntersectionObserverEntry[]) => {
            isLoaderVisible = entry.isIntersecting
        }, loaderConfig)
        i.observe(loader)
        return () => i.disconnect()
    })
</script>

<div class="container">
    {#each initialGifs as gif}
        <div class="gif">
            <Gif {gif} width={gifWidth || getGifWidth(gif, gifHeight)} height={gifHeight} />
        </div>
    {/each}
    <div bind:this={loader} class="loader" />
</div>

<style>
    .gif {
        position: relative;
        display: inline-block;
        list-style: none;
        margin-left: 4px;
        /* make sure gifs are fully visible with a scrollbar */
        margin-bottom: 1px;
    }
    .gif:first-of-type {
        margin-left: 0;
    }
    .container {
        -webkit-overflow-scrolling: touch;
        overflow-x: auto;
        overflow-y: hidden;
        white-space: nowrap;
        position: relative;
    }
    .loader {
        display: inline-block;
        width: 50px;
        height: 50px;
    }
</style>
