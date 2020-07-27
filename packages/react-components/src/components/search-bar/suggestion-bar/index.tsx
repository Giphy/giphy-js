import { IChannel } from '@giphy/js-types'
import { css, cx } from 'emotion'
import React, { useContext, useEffect, useState } from 'react'
import { SearchContext } from '../context'
import { ChannelPill, TrendingSearchPill } from './pills'

const containerCss = css`
    display: flex;
    color: white;
    flex-direction: row;
    font-family: 'interface';
    font-weight: 600;
    font-size: 14px;
    -webkit-overflow-scrolling: touch;
    overflow-x: auto;
    overflow-y: hidden;
    padding-bottom: 10px;
`

const SuggestionBar = () => {
    const { channelSearch, fetchChannelSearch, trendingSearches, activeChannel, theme } = useContext(SearchContext)
    const [channels, setChannels] = useState<IChannel[]>([])
    useEffect(() => {
        const fetchChannels = async () => {
            const channels = await fetchChannelSearch(0)
            setChannels(channels || [])
        }
        if (!activeChannel && channelSearch) {
            fetchChannels()
        }
    }, [channelSearch, activeChannel])
    return (
        <div
            className={cx(
                containerCss,
                css`
                    height: ${theme.searchbarHeight}px;
                    @media (max-width: 480px) {
                        height: ${theme.searchbarHeight - 10}px;
                    }
                `
            )}
        >
            {channels.length > 0
                ? channels.map((channel) => (
                      <ChannelPill key={channel.id} channel={channel} size={theme.searchbarHeight} />
                  ))
                : trendingSearches.map((trendingSearch) => (
                      <TrendingSearchPill key={trendingSearch} trendingSearch={trendingSearch} />
                  ))}
        </div>
    )
}
export default SuggestionBar
