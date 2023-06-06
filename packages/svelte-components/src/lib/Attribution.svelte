<script lang="ts">
    import type { IGif, IProfileUser } from '@giphy/js-types'
    import Avatar from './Avatar.svelte'
    export let gif: IGif
    let shouldDisplay = true
    const user = gif.user as IProfileUser
    if (!user?.username && !user?.display_name) {
        shouldDisplay = false
    }
</script>

{#if shouldDisplay}
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
        <div class="user">{user.display_name || user.username}</div>
    </div>
{/if}

<style>
    .container {
        display: flex;
        align-items: center;
        font-family: interface, helvetica, arial;
        cursor: pointer;
    }
    .user {
        color: white;
        font-size: 16px;
        font-weight: 700;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        -webkit-font-smoothing: antialiased;
    }
</style>
