import { IChannel } from '@giphy/js-types'
import React, { useContext, useEffect, useState } from 'react'
import { SearchContext } from '../context'
import styled, { getSize } from '../theme'
import { ChannelPill, TrendingSearchPill } from './pills'

const Container = styled.div`
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
    ${(props) => getSize(props.theme)}
`

const SuggestionBar = () => {
    const { channelSearch, fetchChannelSearch, trendingSearches, activeChannel } = useContext(SearchContext)
    const [channels, setChannels] = useState<IChannel[]>([])
    useEffect(() => {
        const fetchChannels = async () => {
            const channels = await fetchChannelSearch(0)
            setChannels(channels || [])
        }
        if (!activeChannel && channelSearch) {
            fetchChannels()
        }
        if (!channelSearch && !activeChannel) {
            // revert to trending...
            setChannels([])
        }
    }, [channelSearch, activeChannel, fetchChannelSearch])
    return (
        <Container>
            {channels.length > 0
                ? channels.map((channel) => <ChannelPill key={channel.id} channel={channel} />)
                : trendingSearches.map((trendingSearch) => (
                      <TrendingSearchPill key={trendingSearch} trendingSearch={trendingSearch} />
                  ))}
        </Container>
    )
}
export default SuggestionBar
