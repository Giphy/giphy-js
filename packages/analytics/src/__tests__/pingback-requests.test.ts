import { IGif, IUser } from '@giphy/js-types'
import pingback from '../pingback'
import { addLastSearchResponseId, SESSION_STORAGE_KEY } from '../session'

const gl = ((typeof window !== 'undefined' ? window : global) || {}) as any

describe('pingback', () => {
    afterEach(() => {
        sessionStorage.clear()
    })
    const bottle_data = { tid: 'tid!' }
    const gif: Partial<IGif> = { id: 9870, bottle_data }
    const user: Partial<IUser> = { id: 1234 }
    const responseId = 'search response id'
    beforeEach(() => {
        // @ts-ignore
        fetch.resetMocks()
    })
    test('addLastSearchResponseId', () => {
        addLastSearchResponseId('1')
        expect(JSON.parse(sessionStorage.getItem(SESSION_STORAGE_KEY) as string)).toEqual(['1'])
        addLastSearchResponseId('2')
        addLastSearchResponseId('2')
        expect(JSON.parse(sessionStorage.getItem(SESSION_STORAGE_KEY) as string)).toEqual(['1', '2'])
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
            random_id: gl.giphyRandomId,
        })
    })
    const position = { top: 0, left: 20 } as ClientRect
    test('no response id', () => {
        pingback({
            gif: gif as IGif,
            user,
            // @ts-ignore
            responseId: undefined,
            type: 'GIF_RELATED',
            actionType: 'CLICK',
            position,
        })

        // @ts-ignore
        expect(fetch.mock.calls.length).toEqual(0)
    })
    test('request', () => {
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(['a', 'b', 'c']))
        pingback({
            gif: gif as IGif,
            user,
            type: 'GIF_RELATED',
            responseId,
            actionType: 'CLICK',
            position,
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
        expect(url).toContain('https://pingback.giphy.com/pingback?apikey=l0HlIwPWyBBUDAUgM')
        expect(session.user).toEqual({
            logged_in_user_id: String(user.id),
            random_id: gl.giphyRandomId,
        })
        const [event] = session.events
        const { actions } = event
        delete event.actions
        expect(event).toEqual({
            event_type: 'GIF_RELATED',
            referrer: '',
            response_id: responseId,
            prior_response_id: 'b',
        })
        const [action] = actions
        delete action.ts
        expect(action).toEqual({
            action_type: 'CLICK',
            gif_id: '9870',
            tid: 'tid!',
            attributes: [
                {
                    key: 'position',
                    value: JSON.stringify(position),
                },
            ],
        })

        const {
            sessions: [sessionsNoUser],
        } = JSON.parse(optionsNoUser.body)
        expect(sessionsNoUser.user).toEqual({
            // but there's still a user bc we save it
            logged_in_user_id: String(user.id),
            random_id: gl.giphyRandomId,
        })
    })
    test('request custom attributes', () => {
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(['a', 'b', 'c']))
        pingback({
            gif: gif as IGif,
            user: {},
            type: 'GIF_RELATED',
            responseId,
            actionType: 'CLICK',
            attributes: [{ key: 'position', value: `1` }],
            position,
        })
        // @ts-ignore
        expect(fetch.mock.calls.length).toEqual(1)
        // @ts-ignore
        const [[, options]] = fetch.mock.calls
        const {
            sessions: [session],
        } = JSON.parse(options.body)
        const [event] = session.events
        const { actions } = event
        delete event.actions
        const [action] = actions
        delete action.ts
        expect(action).toEqual({
            action_type: 'CLICK',
            gif_id: '9870',
            tid: 'tid!',
            attributes: [
                {
                    key: 'position',
                    value: `1`,
                },
            ],
        })
    })
})
