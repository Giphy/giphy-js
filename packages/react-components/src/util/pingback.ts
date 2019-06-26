import { pingback, PingbackActionType, bottleData } from '@giphy/js-analytics'
import { IGif, IUser } from '@giphy/js-types'
import { getClientRect } from '@giphy/js-util'

const firePingback = (actionType: PingbackActionType) => (gif: IGif, user: Partial<IUser>, target: HTMLElement) =>
    pingback({
        gif,
        user,
        responseId: gif.response_id,
        type: gif.pingback_event_type,
        actionType,
        position: getClientRect(target),
    })

export const onGifClick = firePingback('CLICK')

export const onGifSeen = (gif: IGif, user: Partial<IUser>, position: ClientRect) => {
    // third party here
    if (gif.bottle_data && gif.bottle_data.tags) {
        bottleData(gif.bottle_data.tags)
    }
    pingback({
        gif,
        user,
        responseId: gif.response_id,
        type: gif.pingback_event_type,
        actionType: 'SEEN',
        position,
    })
}

export const onGifHover = firePingback('HOVER')
