import { IGif } from '@giphy/js-types'
import pingback from '../pingback'
import { PingbackUser } from '../types'

describe('pingback', () => {
    beforeEach(() => {
        // @ts-ignore
        fetch.resetMocks()
    })
    test('request', () => {
        const bottle_data = { tid: 'tid!' }
        const gif: Partial<IGif> = { id: 9870, bottle_data }
        const user: PingbackUser = { id: 1234 }
        const searchResponseId = 'search response id'
        pingback({
            gif: gif as IGif,
            user,
            type: 'related_grid',
            searchResponseId,
            actionType: 'CLICK',
        })
        // @ts-ignore
        expect(fetch.mock.calls.length).toEqual(1)
        // @ts-ignore
        const [[url, options]] = fetch.mock.calls
        const { sessions } = JSON.parse(options.body)
        const [session] = sessions
        // remove api key
        expect(url).toBe('https://pingback.giphy.com/pingback?apikey=l0HlIwPWyBBUDAUgM')
        expect(session.user).toEqual({
            logged_in_user_id: String(user.id),
        })
        const [event] = session.events
        const { actions } = event
        delete event.actions
        expect(event).toEqual({
            event_type: 'GIF_RELATED',
            referrer: '',
            response_id: searchResponseId,
            previous_response_id: '',
        })
        const [action] = actions
        delete action.ts
        expect(action).toEqual({
            action_type: 'CLICK',
            gif_id: '9870',
            tid: 'tid!',
            attributes: [],
        })
    })
})
