<script lang="ts">
    import { gifPaginator, type GifsResult } from '@giphy/js-fetch-api'
    import type { IGif } from '@giphy/js-types'
    import { getGifHeight } from '@giphy/js-util'
    import { onMount } from 'svelte'
    import { debounce } from 'throttle-debounce'
    import Gif from './Gif.svelte'
    export let initialGifs: IGif[] = []
    export let fetchGifs: (offset: number) => Promise<GifsResult>
    export let width: number = 600
    export let columns: number = 4
    export let gutter: number = 6
    let columnTarget: number
    const gutterOffset = gutter * (columns - 1)
    const gifWidth = Math.floor((width - gutterOffset) / columns)
    $: gifHeights = initialGifs.map((gif) => getGifHeight(gif, gifWidth))
    $: isLoaderVisible = false
    $: isFetching = false
    let columnHeights: number[] = Array.apply(null, Array(columns)).map((_) => 0)
    let containerHeight: number
    function getStyle(index: number) {
        columnTarget = columnHeights.indexOf(Math.min(...columnHeights))
        const top = columnHeights[columnTarget]
        const left = columnTarget * gifWidth + columnTarget * gutter
        const height = gifHeights[index]
        if (height) {
            columnHeights[columnTarget] += height + gutter
        }
        containerHeight = Math.max(...columnHeights) - gutter
        return `translate3d(${left}px, ${top}px, 0)`
    }

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
    let paginator = gifPaginator(fetchGifs, initialGifs)
    onMount(() => {
        const i = new IntersectionObserver(([entry]: IntersectionObserverEntry[]) => {
            isLoaderVisible = entry.isIntersecting
        })
        i.observe(loader)
        return () => i.disconnect()
    })
</script>

<div class="container" style="width:{width}px; height:{containerHeight}px;">
    {#each initialGifs as gif, index}
        <div class="gif" style="transform:{getStyle(index)};">
            <Gif {gif} width={gifWidth} />
        </div>
    {/each}
</div>
<div class="loader" bind:this={loader} />

<style>
    .loader {
        width: 100px;
        height: 50px;
        background: red;
    }
    .container {
        overflow: hidden;
        position: relative;
    }
    .gif {
        position: absolute;
    }
</style>
