<script lang="ts">
    import type { IGif, IProfileUser } from '@giphy/js-types'
    import Avatar from './Avatar.svelte'
    import Verified from './Verified.svelte'
    export let gif: IGif
    export let hovered = true
    let shouldDisplay = true
    const user = gif.user as IProfileUser
    if (!user?.username && !user?.display_name) {
        shouldDisplay = false
    }
</script>

{#if shouldDisplay && hovered}
    <div
        class="container"
        on:click|preventDefault|stopPropagation={() => {
            if (user.profile_url) {
                window.open(user.profile_url, '_blank')
            }
        }}
        on:keydown={() => {}}
    >
        <Avatar {user} />
        <div class="user">
            <div class="display-name">
                {user.display_name || user.username}
            </div>
            {#if user.is_verified}
                <Verified />
            {/if}
        </div>
    </div>
{/if}

<style>
    .container {
        display: flex;
        align-items: center;
        font-family: interface, helvetica, arial;
        cursor: pointer;
    }
    .display-name {
        color: white;
        font-size: 16px;
        font-weight: 700;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        -webkit-font-smoothing: antialiased;
    }
    .user {
        display: flex;
        align-items: center;
        min-width: 0;
    }
</style>
