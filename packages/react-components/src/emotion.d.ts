import '@emotion/react'
import type { SearchTheme } from './components/search-bar/theme'

declare module '@emotion/react' {
    export interface Theme extends SearchTheme {}
}
