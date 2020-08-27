import { keyframes } from '@emotion/core'
import styled from '@emotion/styled'
import { giphyDarkCharcoal, giphyLightestGrey } from '@giphy/js-brand'
import React, { useContext } from 'react'
import Avatar_ from '../attribution/avatar'
import VerifiedBadge from '../attribution/verified-badge'
import { SearchContext } from './context'
import { mobileQuery, SearchTheme } from './theme'

const channelMargin = 6

const animateAvatar = (h: number) => keyframes`
to {
    width: ${h}px;
}
`

const Avatar = styled(Avatar_)`
    height: ${(props) => (props.theme as SearchTheme).channelSearch}px;
    margin: 0;
    width: 0;
    animation: ${(props) => animateAvatar((props.theme as SearchTheme).channelSearch)} 100ms ease-in-out forwards;
    @media (${mobileQuery}) {
        height: ${(props) => (props.theme as SearchTheme).smallChannelSearch}px;
        animation: ${(props) => animateAvatar((props.theme as SearchTheme).smallChannelSearch)} 100ms ease-in-out
            forwards;
    }
`

const Username = styled.div`
    background: white;
    display: flex;
    align-items: center;
    padding-left: ${channelMargin}px;
`

const UsernamePill = styled.div`
    background: ${giphyLightestGrey};
    display: flex;
    padding: 0 4px;
    color: ${giphyDarkCharcoal};
    font-family: interface, Helvetica Neue, helvetica, sans-serif;
    font-weight: 600;
    font-size: 12px;
    align-items: center;
    height: ${(props) => (props.theme as SearchTheme).channelSearch}px;
    @media (${mobileQuery}) {
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
