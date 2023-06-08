<script lang="ts">
    import type { IGif } from '@giphy/js-types'
    import Attribution from './Attribution.svelte'
    export let gif: IGif
    export let hovered: boolean
</script>

{#if hovered}
    <div>
        <div class="background" />
        <div class="attr">
            <Attribution {gif} />
        </div>
    </div>
{/if}

<style>
    .attr {
        position: absolute;
        bottom: 10px;
        left: 10px;
        right: 10px;
    }
    .background {
        background: linear-gradient(rgba(0, 0, 0, 0), rgba(18, 18, 18, 0.6));
        cursor: default;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 75px;
        pointer-events: none;
    }
</style>
