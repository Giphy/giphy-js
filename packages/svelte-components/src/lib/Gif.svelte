<script lang="ts">
    import { pingback } from '@giphy/js-analytics'
    import { giphyBlue, giphyGreen, giphyPurple, giphyRed, giphyYellow } from '@giphy/js-brand'
    import type { IGif, ImageAllTypes } from '@giphy/js-types'
    import { getAltText, getBestRendition, getGifHeight } from '@giphy/js-util'
    import { onMount } from 'svelte'

    export let gif: IGif
    export let width = 150
    export let height = getGifHeight(gif, width)
    export let borderRadius = 4
    export let objectFit: 'contain' | 'cover' = 'cover'
    export let onGifClick: (gif: IGif, e: MouseEvent) => void = () => {}

    const analyticsResponsePayload = gif.analytics_response_payload
    const GRID_COLORS = [giphyBlue, giphyGreen, giphyPurple, giphyRed, giphyYellow]
    const background = GRID_COLORS[Math.round(Math.random() * (GRID_COLORS.length - 1))]
    const bestRendition = getBestRendition(gif.images, width, height)
    const rendition = gif.images[bestRendition.renditionName] as ImageAllTypes
    let img: HTMLImageElement
    onMount(() => {
        const i = new IntersectionObserver(
            ([entry]: IntersectionObserverEntry[]) => {
                if (entry.isIntersecting) {
                    if (analyticsResponsePayload) {
                        pingback({
                            analyticsResponsePayload,
                            actionType: 'SEEN',
                            attributes: { position: JSON.stringify(entry.boundingClientRect) },
                        })
                    }
                }
            },
            { threshold: [0.99] }
        )
        i.observe(img)
        return () => i.disconnect()
    })
</script>

<div
    style:background
    style="width:{width}px; height:{height}px; border-radius:{borderRadius}px;"
    on:click={(event) => {
        onGifClick?.(gif, event)
        if (analyticsResponsePayload) {
            pingback({
                analyticsResponsePayload,
                actionType: 'CLICK',
            })
        }
    }}
    on:keydown={() => {}}
    on:keyup={() => {}}
    on:mousedown={() => {}}
    on:mouseup={() => {}}
>
    <picture>
        <source type="image/webp" srcSet={rendition.webp} />
        <img
            bind:this={img}
            style="object-fit:{objectFit}"
            src={rendition.url}
            {width}
            {height}
            alt={getAltText(gif)}
            loading="lazy"
        />
    </picture>
</div>

<style>
    div {
        overflow: hidden;
    }
    img {
        display: block;
    }
</style>
