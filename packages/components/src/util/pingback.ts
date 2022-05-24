import { pingback, PingbackActionType, PingbackAttributes } from '@giphy/js-analytics'
import { IGif } from '@giphy/js-types'
import { getClientRect } from '@giphy/js-util'

const firePingback =
    (actionType: PingbackActionType) =>
    (gif: IGif, userId: string | number | undefined, target: HTMLElement, attributes: PingbackAttributes = {}) => {
        if (!gif.analytics_response_payload) {
            return
        }
        pingback({
            userId,
            actionType,
            attributes: { position: JSON.stringify(getClientRect(target)), ...attributes },
            analyticsResponsePayload: gif.analytics_response_payload,
        })
    }

// no target on this one
export const onGifSeen = (
    gif: IGif,
    userId: string | number | undefined,
    position: DOMRectReadOnly,
    attributes: PingbackAttributes = {}
) => {
    if (!gif.analytics_response_payload) {
        return
    }
    pingback({
        analyticsResponsePayload: gif.analytics_response_payload,
        userId,
        actionType: 'SEEN',
        attributes: { position: JSON.stringify(position), ...attributes },
    })
}

export const onGifClick = firePingback('CLICK')
export const onGifHover = firePingback('HOVER')
