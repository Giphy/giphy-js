import { giphyDarkestGrey } from '@giphy/js-brand'
import { IChannel } from '@giphy/js-types'
import React, { useContext } from 'react'
import Avatar_ from '../../attribution/avatar'
import VerifiedBadge from '../../attribution/verified-badge'
import { SearchContext } from '../context'
import styled, { getSize } from '../theme'
import TrendingIcon_ from './trending-icon'

const margin = 9
const ChannelPillContainer = styled.div`
    background: ${giphyDarkestGrey};
    display: flex;
    padding-right: 4px;
    align-items: center;
    margin-right: ${margin}px;
    cursor: pointer;
`

const TrendingSearchPillContainer = styled.div`
    background: ${giphyDarkestGrey};
    display: flex;
    padding: 14px;
    align-items: center;
    margin-right: ${margin}px;
    white-space: nowrap;
    cursor: pointer;
    font-style: italic;
    border-radius: 20px;
`

const Avatar = styled(Avatar_)`
    ${(props) => getSize(props.theme, true)}
`

const TrendingIcon = styled(TrendingIcon_)`
    margin-right: 2px;
`

export const ChannelPill = ({ channel }: { channel: IChannel }) => {
    const { setActiveChannel } = useContext(SearchContext)
    return (
        <ChannelPillContainer key={channel.id} onClick={() => setActiveChannel(channel)}>
            <Avatar user={channel.user} />
            <div>@{channel.user.username}</div>
            {channel.user.is_verified && <VerifiedBadge size={14} />}
        </ChannelPillContainer>
    )
}

export const TrendingSearchPill = ({ trendingSearch }: { trendingSearch: string }) => {
    const { setSearch } = useContext(SearchContext)
    return (
        <TrendingSearchPillContainer key={trendingSearch} onClick={() => setSearch(trendingSearch)}>
            <TrendingIcon size={16} />
            {trendingSearch}
        </TrendingSearchPillContainer>
    )
}
