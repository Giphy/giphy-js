import { PingbackEventType, pingback, PingbackActionType } from '@giphy/js-analytics'
import { IGif } from '@giphy/js-types'
import { getClientRect } from '@giphy/js-util'

// map this to that to that to that?
// export type Category =
//     | 'search'
//     | 'home'
//     | 'related'
//     | 'gif detail'
//     | 'explore'
//     | 'homeCarousel'

// export type PingbackType =
//     | 'trending_carousel'
//     | 'trending_grid'
//     | 'related_grid'
//     | 'channel_grid'
//     | 'search_grid'
//     | 'universal_search'
//     | 'suggested_terms'
//     | 'explore_grid'

// const map: { [key in PingbackType]: Partial<PingbackEventType> } = {
//     trending_grid: 'GIF_TRENDING',
//     trending_carousel: 'GIF_TRENDING',
//     related_grid: 'GIF_RELATED',
//     channel_grid: 'GIF_CHANNEL',
//     search_grid: 'GIF_SEARCH',
//     universal_search: 'GIF_SEARCH',
//     suggested_terms: 'GIF_SEARCH',
//     explore_grid: 'GIF_EXPLORE',
// }

// DUMMY DATA
const searchResponseId = 'test'
const user = { id: 12345 }

const firePingback = (actionType: PingbackActionType) => (gif: IGif, type: PingbackEventType, e: Event) => {
    pingback({
        gif,
        user,
        searchResponseId,
        type,
        actionType,
        position: getClientRect(e.target as HTMLElement),
    })
}
export const onGifClick = firePingback('CLICK')

export const onGifSeen = (gif: IGif, type: PingbackEventType, position: ClientRect) => {
    pingback({
        gif,
        user,
        searchResponseId,
        type,
        actionType: 'SEEN',
        position,
    })
}
export const onGifHover = firePingback('HOVER')
