<script lang="ts">
    import type { IUser } from '@giphy/js-types'
    export let user: IUser
    const avatar = user.avatar_url
    let src: string
    if (avatar) {
        const ext = avatar?.split('.')?.pop()?.toLowerCase()
        src = avatar.replace(`.${ext}`, `/80h.${ext}`)
    } else {
        const id = Math.floor(Math.random() * 5) + 1
        src = `https://media.giphy.com/avatars/default${id}.gif`
    }
</script>

<img {src} alt={`${user.display_name}'s profile`} />

<style>
    img {
        object-fit: cover;
        width: 32px;
        height: 32px;
        margin-right: 8px;
    }
</style>
