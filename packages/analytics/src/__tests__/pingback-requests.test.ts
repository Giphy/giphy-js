import { IGif, IUser } from '@giphy/js-types'
import pingback from '../pingback'

const gl = ((typeof window !== 'undefined' ? window : global) || {}) as any

describe('pingback', () => {
    const analytics_response_payload = 'analytics_response_payload gif 9870'
    const gif: Partial<IGif> = { id: 9870, analytics_response_payload }

    const user: Partial<IUser> = { id: 1234 }
    afterEach(() => {
        sessionStorage.clear()
    })
    beforeEach(() => {
        // @ts-ignore
        fetch.resetMocks()
    })
    test('no gif, but pingback type', () => {
        pingback({
            actionType: 'CLICK',
            eventType: 'GIF_CHANNEL',
            queueEvents: false,
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
            event_type: 'GIF_CHANNEL',
            random_id: gl.giphyRandomId,
        })
    })
    test('request user_id', () => {
        document.cookie = 'giphy_pbid=1234'
        pingback({
            gif: gif as IGif,
            actionType: 'CLICK',
            queueEvents: false,
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
    test('request no user', () => {
        pingback({
            gif: gif as IGif,
            actionType: 'CLICK',
            queueEvents: false,
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
    test('request', () => {
        const attributes = { position: JSON.stringify({ top: 0, left: 20 }) }
        pingback({
            gif: gif as IGif,
            userId: user?.id,
            actionType: 'FAVORITE',
            attributes,
            queueEvents: false,
        })
        pingback({
            gif: gif as IGif,
            actionType: 'SEEN',
            queueEvents: false,
        })
        // @ts-ignore
        expect(fetch.mock.calls.length).toEqual(2)
        // @ts-ignore
        const [[url, options], [, optionsNoUser]] = fetch.mock.calls
        const {
            events: [event],
        } = JSON.parse(options.body)

        const {
            events: [eventNoUser],
        } = JSON.parse(optionsNoUser.body)
        delete eventNoUser.ts
        // remove api key
        expect(url).toContain('https://pingback.giphy.com/v2/pingback?apikey=l0HlIwPWyBBUDAUgM')
        delete event.ts
        expect(event).toEqual({
            action_type: 'FAVORITE',
            analytics_response_payload,
            logged_in_user_id: String(user.id),
            random_id: gl.giphyRandomId,
            attributes,
        })

        expect(eventNoUser).toEqual({
            action_type: 'SEEN',
            analytics_response_payload,
            // but there's still a user bc we save it
            logged_in_user_id: String(user.id),
            random_id: gl.giphyRandomId,
        })
    })
    test('request custom attributes', () => {
        pingback({
            gif: gif as IGif,
            actionType: 'CLICK',
            attributes: { position: `1` },
            queueEvents: false,
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
            attributes: { position: `1` },
        })
    })

    test('no call since queueEvents is false', async () => {
        pingback({
            gif: gif as IGif,
            actionType: 'CLICK',
        })
        // @ts-ignore
        expect(fetch.mock.calls.length).toEqual(0)
        await new Promise((resolve) => {
            setTimeout(() => resolve(), 1110)
        })
        // @ts-ignore
        expect(fetch.mock.calls.length).toEqual(1)
    })
})
