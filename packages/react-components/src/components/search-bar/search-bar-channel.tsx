import { keyframes } from '@emotion/core'
import styled from '@emotion/styled'
import { giphyDarkCharcoal, giphyLightestGrey } from '@giphy/js-brand'
import React, { useContext } from 'react'
import AvatarSDK from '../attribution/avatar'
import VerifiedBadge from '../attribution/verified-badge'
import { SearchContext } from './context'

const channelMargin = 6

const animateAvatar = (h: number) => keyframes`
to {
    width: ${h}px;
}
`

const Avatar = styled(AvatarSDK)<{ height: number }>`
    height: ${(props) => props.height}px;
    margin: 0;
    width: 0;
    animation: ${(props) => animateAvatar(props.height)} 100ms ease-in-out forwards;
`
const Username = styled.div`
    background: white;
    display: flex;
    align-items: center;
    padding-left: ${channelMargin}px;
`

const UsernamePill = styled.div<{ height: number }>`
    background: ${giphyLightestGrey};
    display: flex;
    padding: 0 4px;
    color: ${giphyDarkCharcoal};
    font-family: interface, Helvetica Neue, helvetica, sans-serif;
    font-weight: 600;
    font-size: 12px;
    align-items: center;
    height: ${(props) => props.height}px;
`

type Props = {
    className?: string
    height: number
}

const SearchBarChannel = ({ className = '', height }: Props) => {
    const { activeChannel } = useContext(SearchContext)
    const channelHeight = height - channelMargin * 2
    return activeChannel ? (
        <Username className={className}>
            <Avatar user={activeChannel.user} height={channelHeight} />
            <UsernamePill height={channelHeight} key={activeChannel.id}>
                <div>@{activeChannel.user.username}</div>
                {activeChannel.user.is_verified && <VerifiedBadge size={14} />}
            </UsernamePill>
        </Username>
    ) : null
}
export default SearchBarChannel
