import { pingback, PingbackActionType, PingbackAttributes } from '@giphy/js-analytics'
import { IGif, IUser } from '@giphy/js-types'
import { getClientRect } from '@giphy/js-util'

const firePingback = (actionType: PingbackActionType) => (
    gif: IGif,
    user: Partial<IUser>,
    target: HTMLElement,
    attributes: PingbackAttributes = {}
) =>
    pingback({
        gif,
        user,
        actionType,
        attributes: { position: JSON.stringify(getClientRect(target)), ...attributes },
    })

// no target on this one
export const onGifSeen = (
    gif: IGif,
    user: Partial<IUser>,
    position: ClientRect,
    attributes: PingbackAttributes = {}
) => {
    pingback({
        gif,
        user,
        actionType: 'SEEN',
        attributes: { position: JSON.stringify(position), ...attributes },
    })
}

export const onGifClick = firePingback('CLICK')
export const onGifHover = firePingback('HOVER')
