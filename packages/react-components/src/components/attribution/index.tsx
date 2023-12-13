'use client'
import { IGif, IProfileUser } from '@giphy/js-types'
import React from 'react'
import styled from 'styled-components'
import Avatar_ from './avatar'
import User from './user'

const Container = styled.div`
    display: flex;
    align-items: center;
    font-family: interface, helvetica, arial;
`
const Avatar = styled(Avatar_)`
    flex-shrink: 0;
`

type Props = { gif: IGif; className?: string; onClick?: (gif: IGif) => void }
const Attribution = ({ gif, className, onClick }: Props) => {
    const { user } = gif
    if (!user?.username && !user?.display_name) {
        return null
    }
    return (
        <Container
            className={[Attribution.className, className].join(' ')}
            onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                if (onClick) {
                    onClick(gif)
                } else {
                    const url = (user as IProfileUser).profile_url
                    if (url) window.open(url, '_blank')
                }
            }}
        >
            <Avatar user={user} />
            <User user={gif.user} />
        </Container>
    )
}
Attribution.className = 'giphy-attribution'
export default Attribution
