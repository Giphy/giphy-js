import styled from '@emotion/styled'
import { IGif, IProfileUser } from '@giphy/js-types'
import React from 'react'
import AvatarSDK from './avatar'
import VerifiedBadgeSDK from './verified-badge'

const Container = styled.div`
    display: flex;
    align-items: center;
    font-family: interface, helvetica, arial;
`
const Avatar = styled(AvatarSDK)`
    flex-shrink: 0;
`
const Username = styled.div`
    color: white;
    font-size: 17px;
    font-weight: 700;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    -webkit-font-smoothing: antialiased;
`
const VerifiedBadge = styled(VerifiedBadgeSDK)`
    margin: 0 4px;
    flex-shrink: 0;
`
type Props = { gif: IGif; className?: string }
const Attribution = ({ gif, className }: Props) => {
    const { user } = gif
    if (!user?.username && !user?.display_name) {
        return null
    }
    const { display_name, username } = user
    return (
        <Container
            className={[Attribution.className, className].join(' ')}
            onClick={(e) => {
                e.preventDefault()
                const url = (user as IProfileUser).profile_url
                if (url) window.open(url, '_blank')
            }}
        >
            <Avatar user={user} />
            <Username>{display_name || `@${username}`}</Username>
            {user.is_verified ? <VerifiedBadge size={14} /> : null}
        </Container>
    )
}
Attribution.className = 'giphy-attribution'
export default Attribution
