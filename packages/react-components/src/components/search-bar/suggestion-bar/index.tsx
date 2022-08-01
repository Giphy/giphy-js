import styled from '@emotion/styled'
import React, { useContext } from 'react'
import { SearchContext } from '../context'
import { getSize } from '../theme'
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
    const { trendingSearches, currentChannels } = useContext(SearchContext)
    return (
        <Container className={SuggestionBar.className}>
            {currentChannels.length > 0
                ? currentChannels.map((channel) => <ChannelPill key={channel.id} channel={channel} />)
                : trendingSearches.map((trendingSearch) => (
                      <TrendingSearchPill key={trendingSearch} trendingSearch={trendingSearch} />
                  ))}
        </Container>
    )
}

SuggestionBar.className = 'giphy-suggestion-bar'

export default SuggestionBar
