import { keyframes } from '@emotion/core'
import { giphyCharcoal, giphyDarkCharcoal, giphyWhite, giphyWhiteSmoke } from '@giphy/js-brand'
import React, { useContext } from 'react'
import Avatar_ from '../attribution/avatar'
import VerifiedBadge from '../attribution/verified-badge'
import { SearchContext } from './context'
import styled, { SearchTheme } from './theme'

const channelMargin = 6

const channelSearchHeight = (theme: SearchTheme) => theme.searchbarHeight - channelMargin * 2
const smallChannelSearchHeight = (theme: SearchTheme) => theme.smallSearchbarHeight - 3 * 2

const animateAvatar = (h: number) => keyframes`
to {
    width: ${h}px;
}
`

const Avatar = styled(Avatar_)`
    height: ${(props) => channelSearchHeight(props.theme)}px;
    margin: 0;
    width: 0;
    animation: ${(props) => animateAvatar(channelSearchHeight(props.theme))} 100ms ease-in-out forwards;
    @media (${(props) => props.theme.condensedMediaQuery}) {
        height: ${(props) => smallChannelSearchHeight(props.theme)}px;
        animation: ${(props) => animateAvatar(smallChannelSearchHeight(props.theme))} 100ms ease-in-out forwards;
    }
`

const Username = styled.div`
    background: ${(props) => (props.theme.mode === 'dark' ? giphyCharcoal : giphyWhite)};
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
    height: ${(props) => channelSearchHeight(props.theme)}px;
    @media (${(props) => props.theme.condensedMediaQuery}) {
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
