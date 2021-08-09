import { IGif } from '@giphy/js-types'

export type GifOverlayProps = {
    gif: IGif
    isHovered: boolean
    onClick?: (gif: IGif) => void
    width?: number
    height?: number
}
