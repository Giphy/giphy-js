import styled from '@emotion/styled'
import { IUser } from '@giphy/js-types'
import React from 'react'
import VerifiedBadge_ from './verified-badge'

export const Username = styled.div`
    color: white;
    font-size: 16px;
    font-weight: 700;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    -webkit-font-smoothing: antialiased;
`
const VerifiedBadge = styled(VerifiedBadge_)`
    margin-left: 4px;
    flex-shrink: 0;
`

const Container = styled.div`
    display: flex;
    align-items: center;
    min-width: 0;
`
const User = ({ user }: { user: IUser }) => {
    const { display_name, username } = user
    return (
        <Container>
            <Username>{display_name || `@${username}`}</Username>
            {user.is_verified ? <VerifiedBadge size={14} /> : null}
        </Container>
    )
}

export default User
