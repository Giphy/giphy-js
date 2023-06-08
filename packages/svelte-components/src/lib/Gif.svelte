<script lang="ts">
    import { pingback } from '@giphy/js-analytics'
    import { giphyBlue, giphyGreen, giphyPurple, giphyRed, giphyYellow } from '@giphy/js-brand'
    import type { IGif, ImageAllTypes } from '@giphy/js-types'
    import { getAltText, getBestRendition, getGifHeight } from '@giphy/js-util'
    import { onMount } from 'svelte'
    import { debounce } from 'throttle-debounce'
    import AttributionOverlay from './AttributionOverlay.svelte'
    import DynamicElement from './DynamicElement.svelte'

    export let gif: IGif
    export let noLink = false
    export let width = 150
    export let height = getGifHeight(gif, width)
    export let borderRadius = 4
    export let objectFit: 'contain' | 'cover' = 'cover'
    export let onGifClick: (e: MouseEvent, gif: IGif) => void = () => {}
    export let onContextMenu: (e: MouseEvent, gif: IGif) => void = () => {}

    const analyticsResponsePayload = gif.analytics_response_payload
    const GRID_COLORS = [giphyBlue, giphyGreen, giphyPurple, giphyRed, giphyYellow]
    const background = GRID_COLORS[Math.round(Math.random() * (GRID_COLORS.length - 1))]
    const bestRendition = getBestRendition(gif.images, width, height)
    const rendition = gif.images[bestRendition.renditionName] as ImageAllTypes
    let img: HTMLImageElement
    let hasFiredSeen = false
    onMount(() => {
        const i = new IntersectionObserver(
            ([entry]: IntersectionObserverEntry[]) => {
                if (entry.isIntersecting && !hasFiredSeen) {
                    hasFiredSeen = true
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
    let hovered = false
    const fireHoverPingback = debounce(200, () => {
        if (hovered && analyticsResponsePayload) {
            pingback({
                analyticsResponsePayload,
                actionType: 'HOVER',
            })
        }
    })
    $: hovered, fireHoverPingback()
</script>

<DynamicElement href={noLink ? '' : gif.url}>
    <div
        on:click={(event) => {
            onGifClick?.(event, gif)
            if (analyticsResponsePayload) {
                pingback({
                    analyticsResponsePayload,
                    actionType: 'CLICK',
                })
            }
        }}
        on:keydown={() => {}}
        on:keyup={() => {}}
        on:focus={() => {}}
        on:mouseleave={() => {
            hovered = false
        }}
        on:mouseover={() => {
            hovered = true
        }}
        on:mouseup={() => {}}
        on:contextmenu={(event) => onContextMenu?.(event, gif)}
        class="container"
        style:background
        style="width:{width}px; height:{height}px; border-radius:{borderRadius}px;"
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
        <slot name="overlay" {gif} {hovered}>
            <AttributionOverlay {gif} {hovered} />
        </slot>
    </div>
</DynamicElement>

<style>
    .container {
        overflow: hidden;
        position: relative;
    }
    img {
        display: block;
    }
</style>
