<script lang="ts">
    import { gifPaginator, type GifsResult } from '@giphy/js-fetch-api'
    import type { IGif } from '@giphy/js-types'
    import { getGifHeight } from '@giphy/js-util'
    import { onMount, type ComponentProps } from 'svelte'
    import { debounce } from 'throttle-debounce'
    import Gif from './Gif.svelte'
    import Loader from './Loader.svelte'

    // if we have gifs we can pass them in as initialGifs
    export let initialGifs: IGif[] = []
    // we'll fetch extra gifs when the loader is visible
    export let fetchGifs: (offset: number) => Promise<GifsResult>
    // loader config lets us trigger a fetch before the user reaches the bottom
    export let loaderConfig = { rootMargin: '0px 0px 250px 0px' }
    // the total width of the grid
    export let width = 600
    // the number of columns in the grid
    export let columns = 4
    // the gutter between gifs
    export let gutter = 6
    // props to be passed along to the Gif component
    export let gifProps: Omit<ComponentProps<Gif>, 'gif' | 'width' | 'height'> = {}
    // masonry - css can't do a masonry layout, so we need to calculate the position of each gif
    let columnTarget: number
    const gutterOffset = gutter * (columns - 1)
    const gifWidth = Math.floor((width - gutterOffset) / columns)
    const columnHeights: number[] = Array.apply(null, Array(columns)).map((_) => 0)
    let containerHeight: number
    let isLoaderVisible = false
    let isFetching = false

    // update the heights when initialGifs change
    $: gifHeights = initialGifs.map((gif) => getGifHeight(gif, gifWidth))

    function getStyle(index: number) {
        columnTarget = columnHeights.indexOf(Math.min(...columnHeights))
        const top = columnHeights[columnTarget]
        const left = columnTarget * gifWidth + columnTarget * gutter
        const height = gifHeights[index]
        if (height) {
            columnHeights[columnTarget] += height + gutter
        }
        // update container height
        containerHeight = Math.max(...columnHeights) - gutter
        return `translate3d(${left}px, ${top}px, 0)`
    }
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

<div class="container" style="width:{width}px; height:{containerHeight}px;">
    {#each initialGifs as gif, index}
        <div class="gif" style="transform:{getStyle(index)};">
            <Gif {gif} width={gifWidth} {...gifProps} on:click on:context />
        </div>
    {/each}
</div>
<div bind:this={loader}>
    <Loader />
</div>

<style>
    .container {
        overflow: hidden;
        position: relative;
    }
    .gif {
        position: absolute;
    }
</style>
