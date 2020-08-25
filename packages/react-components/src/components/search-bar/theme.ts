import { css } from '@emotion/core'

export const mobileQuery = `max-width: 480px`

export type SearchTheme = {
    searchbarHeight: number
    smallSearchbarHeight: number
    channelSearch: number
    smallChannelSearch: number
}

const channelSearchSize = (size: number, margin = 6) => size - margin * 2
export const initTheme = (theme?: Partial<SearchTheme>): SearchTheme => {
    const defaultTheme = {
        searchbarHeight: 42,
        smallSearchbarHeight: 35,
        ...theme,
    }
    return {
        ...defaultTheme,
        channelSearch: channelSearchSize(defaultTheme.searchbarHeight),
        smallChannelSearch: channelSearchSize(defaultTheme.smallSearchbarHeight, 3),
    }
}

// DRY but kinda ugly
export const getSize = (theme: SearchTheme, includeWidth: boolean = false) => css`
    height: ${theme.searchbarHeight}px;
    ${includeWidth &&
    css`
        width: ${theme.searchbarHeight}px;
    `};
    @media (${mobileQuery}) {
        height: ${theme.smallSearchbarHeight}px;
        ${includeWidth &&
        css`
            width: ${theme.smallSearchbarHeight}px;
        `};
    }
`
