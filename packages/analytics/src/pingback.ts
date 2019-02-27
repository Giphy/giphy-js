import {
    searchPingBackEvent,
    trendingGridPingBackEvent,
    relatedPingBackEvent,
    explorePingBackEvent,
    trendingCarouselPingBackEvent,
} from './pingback-requests'
import { IGif } from '@giphy/js-types'
import { IPingbackUser } from './types'

const pingbackFunction = {
    search: searchPingBackEvent,
    home: trendingGridPingBackEvent,
    related: relatedPingBackEvent,
    'gif detail': relatedPingBackEvent,
    channel: null,
    explore: explorePingBackEvent,
    homeCarousel: trendingCarouselPingBackEvent,
}

export enum Action {
    click = 'CLICK',
    seen = 'SEEN',
    hover = 'HOVER',
}

export type Pingback = {
    gif: IGif
    user: IPingbackUser
    category: string
    searchResponseId: string
    action: Action
    position?: ClientRect
}

type PingbackRequestAction = {
    action_type: string
    ts: number
    gif_id: string | number
    tid: string
    attributes: any[]
}

function firePingback(
    action: PingbackRequestAction,
    category: string,
    searchResponseId: string,
    user: IPingbackUser,
    skipQueue = false,
) {
    const pingbackRequest = pingbackFunction[category]
    // check to see if there are pingback events to send && make sure you dont duplicate the batch call
    pingbackRequest(action, searchResponseId, user, skipQueue)
}

type Attribute = {
    key: string
    value: string
}
function createPingbackAction(
    actionType: string,
    gifId: string | number,
    tid: string,
    position?: ClientRect,
): PingbackRequestAction {
    let attributes: Attribute[] = []
    if (position) {
        attributes.push({
            key: `position`,
            value: JSON.stringify(position),
        })
    }
    return {
        action_type: actionType,
        ts: new Date().getTime(),
        gif_id: gifId,
        tid: tid,
        attributes,
    }
}

const formatPingbackAndFire = (
    { id, bottle_data = { tid: '' } }: IGif,
    user: IPingbackUser,
    searchResponseId: string,
    actionType: Action,
    category: string,
    position?: ClientRect,
) => {
    const { tid } = bottle_data
    const action = createPingbackAction(actionType, id, tid, position)
    firePingback(action, category, searchResponseId, user, !!tid)
}

const pingback = ({ gif, user, searchResponseId, category, action, position }: Pingback) =>
    formatPingbackAndFire(gif, user, searchResponseId, action, category, position)

export default pingback
