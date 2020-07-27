import { giphyDarkestGrey } from '@giphy/js-brand'
import { IChannel } from '@giphy/js-types'
import { css } from 'emotion'
import React, { useContext } from 'react'
import Avatar from '../../attribution/avatar'
import VerifiedBadge from '../../attribution/verified-badge'
import { SearchContext } from '../context'
import TrendingIcon from './trending-icon'

const margin = 9
const channelPillCss = css`
    background: ${giphyDarkestGrey};
    display: flex;
    padding-right: 4px;
    align-items: center;
    margin-right: ${margin}px;
    cursor: pointer;
`

const trendingSearchPillCss = css`
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

export const ChannelPill = ({ channel, size }: { channel: IChannel; size: number }) => {
    const { setActiveChannel } = useContext(SearchContext)
    return (
        <div key={channel.id} className={channelPillCss} onClick={() => setActiveChannel(channel)}>
            <Avatar
                user={channel.user}
                className={css`
                    width: ${size}px;
                    height: ${size}px;
                `}
            />
            <div>@{channel.user.username}</div>
            {channel.user.is_verified && <VerifiedBadge size={14} />}
        </div>
    )
}

export const TrendingSearchPill = ({ trendingSearch }: { trendingSearch: string }) => {
    const { setSearch } = useContext(SearchContext)
    return (
        <div key={trendingSearch} className={trendingSearchPillCss} onClick={() => setSearch(trendingSearch, '')}>
            <TrendingIcon
                size={16}
                className={css`
                    margin-right: 2px;
                `}
            />
            {trendingSearch}
        </div>
    )
}
