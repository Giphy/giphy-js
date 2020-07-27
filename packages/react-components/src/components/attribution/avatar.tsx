import { IUser } from '@giphy/js-types'
import { css, cx } from 'emotion'
import React, { useRef } from 'react'

const getSmallAvatar = (avatar: string) => {
    if (!avatar) return ''
    const ext = avatar?.split('.')?.pop()?.toLowerCase()
    return avatar.replace(`.${ext}`, `/80h.${ext}`)
}

const avatarCss = css`
    object-fit: cover;
    width: 32px;
    height: 32px;
    margin-right: 8px;
`
type Props = { user: IUser; className?: string }
const Avatar = ({ user, className = '' }: Props) => {
    const defaultAvatarId = useRef<number>(Math.floor(Math.random() * 5) + 1)
    const url = user.avatar_url
        ? getSmallAvatar(user.avatar_url)
        : `https://media.giphy.com/avatars/default${defaultAvatarId.current}.gif`
    return <img src={url} className={cx(avatarCss, className)} />
}

export default Avatar
