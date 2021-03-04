import { pingback, PingbackActionType, PingbackAttributes } from '@giphy/js-analytics'
import { IGif, PingbackEventType } from '@giphy/js-types'
import { getClientRect } from '@giphy/js-util'

const firePingback = (actionType: PingbackActionType) => (
    gif: IGif,
    userId: string | number | undefined,
    target: HTMLElement,
    attributes: PingbackAttributes = {},
    eventType: PingbackEventType | undefined = undefined
) => {
    if (!gif.analytics_response_payload) {
        return
    }
    pingback({
        userId,
        actionType,
        eventType,
        attributes: { position: JSON.stringify(getClientRect(target)), ...attributes },
        analyticsResponsePayload: gif.analytics_response_payload,
    })
}

// no target on this one
export const onGifSeen = (
    gif: IGif,
    userId: string | number | undefined,
    position: ClientRect,
    attributes: PingbackAttributes = {},
    eventType: PingbackEventType | undefined = undefined
) => {
    if (!gif.analytics_response_payload) {
        return
    }
    pingback({
        analyticsResponsePayload: gif.analytics_response_payload,
        userId,
        actionType: 'SEEN',
        eventType,
        attributes: { position: JSON.stringify(position), ...attributes },
    })
}

export const onGifClick = firePingback('CLICK')
export const onGifHover = firePingback('HOVER')
