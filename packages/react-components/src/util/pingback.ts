import { pingback, PingbackActionType, PingbackAttribute } from '@giphy/js-analytics'
import { IGif, IUser } from '@giphy/js-types'
import { getClientRect } from '@giphy/js-util'

const firePingback = (actionType: PingbackActionType) => (
    gif: IGif,
    user: Partial<IUser>,
    target: HTMLElement,
    attributes: PingbackAttribute[] = []
) =>
    pingback({
        gif,
        user,
        responseId: gif.response_id,
        type: gif.pingback_event_type,
        actionType,
        position: getClientRect(target),
        attributes,
    })

// these have position from the target
export const onGifHover = firePingback('HOVER')
export const onGifClick = firePingback('CLICK')

export const onGifSeen = (
    gif: IGif,
    user: Partial<IUser>,
    position: ClientRect,
    attributes: PingbackAttribute[] = []
) => {
    pingback({
        gif,
        user,
        responseId: gif.response_id,
        type: gif.pingback_event_type,
        actionType: 'SEEN',
        position,
        attributes,
    })
}
