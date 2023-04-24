import { IGif } from '@giphy/js-types'

export type GifOverlayProps = {
    gif: IGif
    isHovered: boolean
    onClick?: (gif: IGif) => void
    width?: number
    height?: number
}

export type VideoOverlayProps = GifOverlayProps & {
    width: number
    height?: number
    className?: string
    muted?: boolean // force this to be muted
    hideMuteButton?: boolean
    onUserMuted?: (muted: boolean) => void // for saving the state of the user muted
}