import { IGif, IUser } from '@giphy/js-types'
import pingback from '../pingback'

const gl = ((typeof window !== 'undefined' ? window : global) || {}) as any

describe('pingback', () => {
    const analytics_response_payload = 'analytics_response_payload gif 9870'
    const gif: Partial<IGif> = { id: 9870, analytics_response_payload }
    // @ts-ignore
    gif.skipQueue = Symbol('skipQueue')

    const user: Partial<IUser> = { id: 1234 }
    beforeEach(() => {
        // @ts-ignore
        fetch.resetMocks()
    })
    test('request no user', () => {
        pingback({
            gif: gif as IGif,
            user: {},
            actionType: 'CLICK',
        })

        // @ts-ignore
        expect(fetch.mock.calls.length).toEqual(1)
        // @ts-ignore
        const [[, options]] = fetch.mock.calls
        const {
            events: [eventNoUser],
        } = JSON.parse(options.body)
        delete eventNoUser.ts
        expect(eventNoUser).toEqual({
            analytics_response_payload,
            action_type: 'CLICK',
            random_id: gl.giphyRandomId,
        })
    })
    test('request user_id', () => {
        document.cookie = 'giphy_pbid=1234'
        pingback({
            gif: gif as IGif,
            user: {},
            actionType: 'CLICK',
        })
        document.cookie = 'giphy_pbid='

        // @ts-ignore
        expect(fetch.mock.calls.length).toEqual(1)
        // @ts-ignore
        const [[, options]] = fetch.mock.calls
        const {
            events: [eventNoUser],
        } = JSON.parse(options.body)
        delete eventNoUser.ts
        expect(eventNoUser).toEqual({
            analytics_response_payload,
            action_type: 'CLICK',
            user_id: '1234',
            // no random id here
        })
    })
    const position = { top: 0, left: 20 } as ClientRect
    const attributes = [
        {
            key: 'position',
            value: JSON.stringify(position),
        },
    ]
    test('request', () => {
        pingback({
            gif: gif as IGif,
            user,
            actionType: 'CLICK',
            position,
        })
        pingback({
            gif: gif as IGif,
            user: {},
            actionType: 'CLICK',
        })
        // @ts-ignore
        expect(fetch.mock.calls.length).toEqual(2)
        // @ts-ignore
        const [[url, options], [, optionsNoUser]] = fetch.mock.calls
        const {
            events: [event],
        } = JSON.parse(options.body)
        // remove api key
        expect(url).toContain('https://pingback.giphy.com/pingback?apikey=l0HlIwPWyBBUDAUgM')
        delete event.ts
        expect(event).toEqual({
            action_type: 'CLICK',
            analytics_response_payload,
            logged_in_user_id: String(user.id),
            random_id: gl.giphyRandomId,
            attributes,
        })
        const {
            events: [eventNoUser],
        } = JSON.parse(optionsNoUser.body)
        delete eventNoUser.ts
        expect(eventNoUser).toEqual({
            action_type: 'CLICK',
            analytics_response_payload,
            // but there's still a user bc we save it
            logged_in_user_id: String(user.id),
            random_id: gl.giphyRandomId,
        })
    })
    test('request custom attributes', () => {
        pingback({
            gif: gif as IGif,
            user: {},
            actionType: 'CLICK',
            attributes: [{ key: 'position', value: `1` }],
            position,
        })
        // @ts-ignore
        expect(fetch.mock.calls.length).toEqual(1)
        // @ts-ignore
        const [[, options]] = fetch.mock.calls
        const {
            events: [event],
        } = JSON.parse(options.body)
        delete event.ts
        expect(event).toEqual({
            action_type: 'CLICK',
            analytics_response_payload,
            logged_in_user_id: String(user.id),
            random_id: gl.giphyRandomId,
            attributes: [
                {
                    key: 'position',
                    value: `1`,
                },
            ],
        })
    })
})
