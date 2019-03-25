import { IGif, IUser } from '@giphy/js-types'
import pingback from '../pingback'

describe('pingback', () => {
    const bottle_data = { tid: 'tid!' }
    const gif: Partial<IGif> = { id: 9870, bottle_data }
    const user: Partial<IUser> = { id: 1234 }
    const responseId = 'search response id'
    beforeEach(() => {
        // @ts-ignore
        fetch.resetMocks()
    })
    test('request no user', () => {
        pingback({
            gif: gif as IGif,
            user: {},
            type: 'GIF_RELATED',
            responseId,
            actionType: 'CLICK',
        })

        // @ts-ignore
        expect(fetch.mock.calls.length).toEqual(1)
        // @ts-ignore
        const [[, options]] = fetch.mock.calls
        const {
            sessions: [sessionsNoUser],
        } = JSON.parse(options.body)
        expect(sessionsNoUser.user).toEqual({
            logged_in_user_id: '',
        })
    })
    test('request', () => {
        pingback({
            gif: gif as IGif,
            user,
            type: 'GIF_RELATED',
            responseId,
            actionType: 'CLICK',
        })
        pingback({
            gif: gif as IGif,
            user: {},
            type: 'GIF_RELATED',
            responseId,
            actionType: 'CLICK',
        })

        // @ts-ignore
        expect(fetch.mock.calls.length).toEqual(2)
        // @ts-ignore
        const [[url, options], [, optionsNoUser]] = fetch.mock.calls
        const {
            sessions: [session],
        } = JSON.parse(options.body)
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
            response_id: responseId,
            prior_response_id: '',
        })
        const [action] = actions
        delete action.ts
        expect(action).toEqual({
            action_type: 'CLICK',
            gif_id: '9870',
            tid: 'tid!',
            attributes: [],
        })

        const {
            sessions: [sessionsNoUser],
        } = JSON.parse(optionsNoUser.body)
        expect(sessionsNoUser.user).toEqual({
            // but there's still a user bc we save it
            logged_in_user_id: String(user.id),
        })
    })
})
