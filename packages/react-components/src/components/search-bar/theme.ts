import { css } from '@emotion/core'

export type SearchTheme = { searchbarHeight: number; smallSearchbarHeight: number }

const mobileQuery = `max-width: 480px`
export const getHeight = (theme: SearchTheme) => css`
    height: ${theme.searchbarHeight}px;
    @media (${mobileQuery}) {
        height: ${theme.smallSearchbarHeight}px;
    }
`

export const getSize = (theme: SearchTheme) => css`
    height: ${theme.searchbarHeight}px;
    width: ${theme.searchbarHeight}px;
    @media (${mobileQuery}) {
        height: ${theme.smallSearchbarHeight}px;
        width: ${theme.smallSearchbarHeight}px;
    }
`
