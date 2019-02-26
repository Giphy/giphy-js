import { pingback, PingbackAction } from '@giphy-js/analytics'
import { getClientRect } from '@giphy-js/util'
import { IGif } from '@giphy-js/types'

// DUMMY DATA
const searchResponseId = 'test'
const category = 'related'
const user = { id: 12345 }

const firePingback = (action: PingbackAction) => (gif: IGif, e: Event) => {
    pingback({
        gif,
        user,
        searchResponseId,
        category,
        action,
        position: getClientRect(e.target as HTMLElement),
    })
}
export const onGifClick = firePingback(PingbackAction.click)
export const onGifSeen = (gif: IGif, position: ClientRect) => {
    pingback({
        gif,
        user,
        searchResponseId,
        category,
        action: PingbackAction.seen,
        position,
    })
}
export const onGifHover = firePingback(PingbackAction.hover)
