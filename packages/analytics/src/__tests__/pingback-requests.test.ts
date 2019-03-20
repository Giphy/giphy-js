import { createSession } from '../pingback'

test('pingback-requests', () => {
    const getEvent = (event_type: string) => ({
        user: {
            user_id: undefined,
            logged_in_user_id: '',
        },
        events: [
            {
                event_type,
                response_id: undefined,
                referrer: null,
                actions: undefined,
                previous_response_id: null,
            },
        ],
    })
    let session = createSession('trending_carousel')
    expect(session).toEqual(getEvent('GIF_TRENDING'))

    session = createSession('trending_grid')
    expect(session).toEqual(getEvent('GIF_TRENDING'))

    session = createSession('related_grid')
    expect(session).toEqual(getEvent('GIF_RELATED'))

    session = createSession('channel_grid')
    expect(session).toEqual(getEvent('GIF_CHANNEL'))

    session = createSession('search_grid')
    expect(session).toEqual(getEvent('GIF_SEARCH'))

    session = createSession('universal_search')
    expect(session).toEqual(getEvent('GIF_SEARCH'))

    session = createSession('suggested_terms')
    expect(session).toEqual(getEvent('GIF_SEARCH'))

    session = createSession('explore_grid')
    expect(session).toEqual(getEvent('GIF_EXPLORE'))
})
