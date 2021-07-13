import { IGif, IUser } from '@giphy/js-types'
import { getPingbackId } from '@giphy/js-util'
import fetch from 'jest-fetch-mock'
import pingback from '../pingback'

function getRequest(init: RequestInit = {}): { events: [any] } {
    return init.body ? JSON.parse(init.body.toString()) : ''
}

describe('pingback', () => {
    const analytics_response_payload = 'analytics_response_payload gif 9870'
    const gif: Partial<IGif> = { id: 9870, analytics_response_payload }
    const user: Partial<IUser> = { id: 1234 }
    beforeEach(() => {
        fetch.resetMocks()
    })
    test('no gif, but pingback type', () => {
        // @ts-ignore
        pingback({
            actionType: 'CLICK',
            eventType: 'GIF_CHANNEL',
            queueEvents: false,
        })
        expect(fetch.mock.calls.length).toEqual(1)
        const [[, options]] = fetch.mock.calls
        const {
            events: [event],
        } = getRequest(options)
        delete event.ts
        expect(event).toEqual({
            action_type: 'CLICK',
            event_type: 'GIF_CHANNEL',
            user_id: getPingbackId(),
        })
    })
    test('request user_id', () => {
        pingback({
            analyticsResponsePayload: gif.analytics_response_payload || '',
            actionType: 'CLICK',
            queueEvents: false,
        })
        expect(fetch.mock.calls.length).toEqual(1)
        const [[, options]] = fetch.mock.calls
        const {
            events: [eventNoUser],
        } = getRequest(options)
        delete eventNoUser.ts
        expect(eventNoUser).toEqual({
            analytics_response_payload,
            action_type: 'CLICK',
            user_id: getPingbackId(),
            // no random id here
        })
    })
    test('request no user', () => {
        pingback({
            analyticsResponsePayload: gif.analytics_response_payload || '',
            actionType: 'CLICK',
            queueEvents: false,
        })
        expect(fetch.mock.calls.length).toEqual(1)
        const [[, options]] = fetch.mock.calls
        const {
            events: [eventNoUser],
        } = getRequest(options)
        delete eventNoUser.ts
        expect(eventNoUser).toEqual({
            analytics_response_payload,
            action_type: 'CLICK',
            user_id: getPingbackId(),
        })
    })
    test('request', () => {
        const attributes = { position: JSON.stringify({ top: 0, left: 20 }) }
        pingback({
            analyticsResponsePayload: gif.analytics_response_payload || '',
            userId: user?.id,
            actionType: 'FAVORITE',
            attributes,
            queueEvents: false,
        })
        pingback({
            analyticsResponsePayload: gif.analytics_response_payload || '',
            actionType: 'SEEN',
            queueEvents: false,
        })

        expect(fetch.mock.calls.length).toEqual(2)

        const [[url, options], [, optionsNoUser]] = fetch.mock.calls
        const {
            events: [event],
        } = getRequest(options)

        const {
            events: [eventNoUser],
        } = getRequest(optionsNoUser)
        delete eventNoUser.ts
        // remove api key
        expect(url).toContain('https://pingback.giphy.com/v2/pingback?apikey=l0HlIwPWyBBUDAUgM')
        delete event.ts
        expect(event).toEqual({
            action_type: 'FAVORITE',
            analytics_response_payload,
            logged_in_user_id: String(user.id),
            user_id: getPingbackId(),
            attributes,
        })

        expect(eventNoUser).toEqual({
            action_type: 'SEEN',
            analytics_response_payload,
            // but there's still a user bc we save it
            logged_in_user_id: String(user.id),
            user_id: getPingbackId(),
        })
    })
    test('request custom attributes', () => {
        pingback({
            analyticsResponsePayload: gif.analytics_response_payload || '',
            actionType: 'CLICK',
            attributes: { position: `1` },
            queueEvents: false,
        })
        expect(fetch.mock.calls.length).toEqual(1)
        const [[, options]] = fetch.mock.calls
        const {
            events: [event],
        } = getRequest(options)
        delete event.ts
        expect(event).toEqual({
            action_type: 'CLICK',
            analytics_response_payload,
            logged_in_user_id: String(user.id),
            user_id: getPingbackId(),
            attributes: { position: `1` },
        })
    })

    test('no call since queueEvents is false', async () => {
        pingback({
            analyticsResponsePayload: gif.analytics_response_payload || '',
            actionType: 'CLICK',
        })
        expect(fetch.mock.calls.length).toEqual(0)
        await new Promise<void>((resolve) => {
            setTimeout(() => resolve(), 1110)
        })
        expect(fetch.mock.calls.length).toEqual(1)
    })
})
