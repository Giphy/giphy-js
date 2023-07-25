import { giphyDarkCharcoal, giphyWhiteSmoke } from '@giphy/colors'
import React, { useContext } from 'react'
import styled, { keyframes } from 'styled-components'
import Avatar_ from '../attribution/avatar'
import VerifiedBadge from '../attribution/verified-badge'
import { CssVars, SearchContext } from './context'

const channelMargin = 6
const innerHeight = `calc(var(${CssVars.searchbarHeight}) - ${channelMargin * 2}px)`
const animateAvatar = keyframes`
to {
    width: ${innerHeight};
}
`

const Avatar = styled(Avatar_)`
    height: ${innerHeight};
    margin: 0;
    width: 0;
    animation: ${animateAvatar} 100ms ease-in-out forwards;
`

const Username = styled.div`
    background: var(${CssVars.bgColor2});
    display: flex;
    align-items: center;
    padding-left: ${channelMargin}px;
`

const UsernamePill = styled.div`
    background: ${giphyWhiteSmoke};
    display: flex;
    padding: 0 4px;
    color: ${giphyDarkCharcoal};
    font-family: interface, Helvetica Neue, helvetica, sans-serif;
    font-weight: 600;
    font-size: 12px;
    align-items: center;
    height: ${innerHeight};
    @media (max-width: 480px) {
        display: none;
    }
`

type Props = {
    className?: string
}

const SearchBarChannel = ({ className = '' }: Props) => {
    const { activeChannel } = useContext(SearchContext)
    return activeChannel ? (
        <Username className={className}>
            <Avatar user={activeChannel.user} />
            <UsernamePill key={activeChannel.id}>
                <div>@{activeChannel.user.username}</div>
                {activeChannel.user.is_verified && <VerifiedBadge size={14} />}
            </UsernamePill>
        </Username>
    ) : null
}
export default SearchBarChannel
