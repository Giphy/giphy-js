<script lang="ts">
    import type { IGif } from '@giphy/js-types'
    import { getGifHeight } from '@giphy/js-util'
    import Gif from './Gif.svelte'
    export let initialGifs: IGif[] = []
    export let width: number = 600
    export let columns: number = 3
    export let gutter: number = 6
    let columnTarget: number
    const gutterOffset = gutter * (columns - 1)
    const gifWidth = Math.floor((width - gutterOffset) / columns)
    const gifHeights = initialGifs.map((gif) => getGifHeight(gif, gifWidth))
    let columnHeights: number[] = Array.apply(null, Array(columns)).map((_) => 0)
    let containerHeight = Math.max.apply(Math, columnHeights) - gutter
    function getStyle(index: number) {
        columnTarget = columnHeights.indexOf(Math.min.apply(Math, columnHeights))
        const top = columnHeights[columnTarget]
        const left = columnTarget * gifWidth + columnTarget * gutter
        const height = gifHeights[index]
        if (height) {
            columnHeights[columnTarget] += height + gutter
        }
        containerHeight = Math.max.apply(Math, columnHeights) - gutter
        return `translate3d(${left}px, ${top}px, 0)`
    }
</script>

<div class="container" style="width:{width}px; height:{containerHeight}px;">
    {#each initialGifs as gif, index}
        <div class="gif" style="transform:{getStyle(index)};">
            <Gif {gif} width={gifWidth} />
        </div>
    {/each}
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
