import { css } from '@emotion/core'

export const mobileQuery = `max-width: 480px`

export type SearchTheme = {
    // the height of the search bar on desktop
    searchbarHeight: number
    // the height of the search bar on mobile
    smallSearchbarHeight: number
}

export const initTheme = (theme?: Partial<SearchTheme>): SearchTheme => {
    return {
        searchbarHeight: 42,
        smallSearchbarHeight: 35,
        ...theme,
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
