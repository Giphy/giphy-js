import { IUser } from '@giphy/js-types'
import React, { useRef } from 'react'
import styled from 'styled-components'

const getSmallAvatar = (avatar: string) => {
    if (!avatar) return ''
    const ext = avatar?.split('.')?.pop()?.toLowerCase()
    return avatar.replace(`.${ext}`, `/80h.${ext}`)
}

const Img = styled.img`
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
    return <Img src={url} className={className} />
}

export default Avatar
