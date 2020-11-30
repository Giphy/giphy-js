import { css } from '@emotion/core'
import styled, { CreateStyled } from '@emotion/styled'

export type SearchTheme = {
    mode: 'dark' | 'light'
    // the height of the search bar on desktop
    searchbarHeight: number
    // the height of the search bar on mobile
    smallSearchbarHeight: number
    condensedMediaQuery?: string
    condensedMode?: boolean
}

export const initTheme = (theme?: Partial<SearchTheme>): SearchTheme => {
    return {
        mode: 'light',
        searchbarHeight: 42,
        smallSearchbarHeight: 35,
        // bump the condensedMediaQuery to force if condensedMode is true
        condensedMediaQuery: theme?.condensedMode ? `max-width: 99999px` : `max-width: 480px`,
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
    @media (${theme.condensedMediaQuery}) {
        height: ${theme.smallSearchbarHeight}px;
        ${includeWidth &&
        css`
            width: ${theme.smallSearchbarHeight}px;
        `};
    }
`

export default styled as CreateStyled<SearchTheme>
