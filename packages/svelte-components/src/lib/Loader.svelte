<script lang="ts">
    import { giphyBlue, giphyGreen, giphyPurple, giphyRed, giphyYellow } from '@giphy/js-brand'
</script>

<div class="container">
    <div style="background:{giphyGreen}" class="block" />
    <div style="background:{giphyBlue}" class="block" />
    <div style="background:{giphyRed}" class="block" />
    <div style="background:{giphyPurple}" class="block" />
    <div style="background:{giphyYellow}" class="block" />
</div>

<style>
    @keyframes bouncer {
        0% {
            transform: scale(1);
        }
        100% {
            transform: scale(1.5);
        }
    }
    .container {
        display: flex;
        align-items: center;
        height: 37px;
        padding-top: 15px;
        margin: 0 auto;
        text-align: center;
        justify-content: center;
        animation: pulse 0.8s ease-in-out 0s infinite alternate backwards;
    }
    .block {
        display: inline-block;
        height: 10px;
        width: 10px;
        margin: 37px 10px 10px 10px;
        position: relative;
        box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.3);
        animation: bouncer cubic-bezier(0.455, 0.03, 0.515, 0.955) 0.75s infinite alternate;
    }
    .block:nth-child(5n + 1) {
        animation-delay: 0;
    }
    .block:nth-child(5n + 2) {
        animation-delay: calc(0s + (0.1s * 1));
    }
    .block:nth-child(5n + 3) {
        animation-delay: calc(0s + (0.1s * 2));
    }
    .block:nth-child(5n + 4) {
        animation-delay: calc(0s + (0.1s * 3));
    }
    .block:nth-child(5n + 5) {
        animation-delay: calc(0s + (0.1s * 4));
    }
</style>
