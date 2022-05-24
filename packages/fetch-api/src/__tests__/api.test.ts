import { IGif } from '@giphy/js-types'
import 'jest-fetch-mock'
import GiphyFetchAPI from '../api'
import { DEFAULT_ERROR, ERROR_PREFIX } from '../request'

const dummyGif = {
    id: 12345,
    tags: [{ text: 'text prop' }, 'regular tag'],
    is_hidden: 0,
    analytics_response_payload: 'ARP',
    images: {
        fixed_width: { width: '12', height: '14' },
    },
}
const pagination = {}
const meta = {
    response_id: 'response id',
}
const gifsResponse = {
    data: [dummyGif],
    pagination,
    meta,
}
const gifsResponseNoTags = {
    data: [{ id: 456, is_hidden: 0, analytics_response_payload: 'ARP' }],
    pagination,
    meta,
}
const gifResponse = {
    data: dummyGif,
    pagination,
    meta,
}
const okResponseWithError = {
    ...gifsResponse,
    message: "response was okay, but here's a message",
}
const gifResponseWithUser = {
    ...gifResponse,
    data: {
        ...dummyGif,
        user: {
            id: 1234,
            is_verified: 0,
        },
    },
}

const category = { name: 'news & politics', name_encoded: 'news-politics' }
const categoriesResponse = {
    data: [category],
    meta: {
        response_id: 'category response id ',
    },
}

const syntheticResponse = {
    data: [],
    meta: {
        msg: 'OK',
        response_id: '',
    },
}
const gf = new GiphyFetchAPI('4OMJYpPoYwVpe')
const testDummyGif = (gif: IGif) => {
    expect(gif.id).toBe('12345')
    expect(gif.tags).toEqual(['text prop', 'regular tag'])
    expect(gif.is_hidden).toBe(false)
}
describe('response parsing', () => {
    beforeEach(() => {
        // possibly reset requestMap in request, which is a cache
        fetchMock.resetMocks()
    })
    test('categories', async () => {
        fetchMock.mockResponseOnce(JSON.stringify(categoriesResponse))
        const { data } = await gf.categories()
        expect(data[0].name).toBe(category.name)
        expect(data[0].name_encoded).toBe(category.name_encoded)
    })
    test('gif', async () => {
        fetchMock.mockResponseOnce(JSON.stringify(gifResponse))
        const { data } = await gf.gif('12345')
        testDummyGif(data)
    })

    test('gif images', async () => {
        fetchMock.mockResponseOnce(JSON.stringify(gifResponse))
        const { data } = await gf.gif('12345')
        expect(data.images.fixed_width.height).toBe(14)
        expect(data.images.fixed_width.width).toBe(12)
        testDummyGif(data)
    })
    test('gif w user', async () => {
        fetchMock.mockResponseOnce(JSON.stringify(gifResponseWithUser))
        const { data } = await gf.gif('45667')
        testDummyGif(data)
        expect(data.user.is_verified).toBe(false)
    })
    test('gifs', async () => {
        fetchMock.mockResponseOnce(JSON.stringify(gifsResponse))
        const { data } = await gf.gifs(['12345'])
        testDummyGif(data[0])
    })
    test('search with sticker type', async () => {
        fetchMock.mockResponseOnce(JSON.stringify(gifsResponse))
        const { data } = await gf.search('some term', { type: 'stickers' })
        testDummyGif(data[0])
    })
    test('gifs no tags', async () => {
        fetchMock.resetMocks()
        fetchMock.mockResponseOnce(JSON.stringify(gifsResponseNoTags))
        const { data } = await gf.gifs(['456'])
        const [gif] = data
        expect(gif.id).toBe('456')
        expect(gif.tags).toEqual([])
        expect(gif.is_hidden).toBe(false)
    })
    test('gifs by category', async () => {
        fetchMock.mockResponseOnce(JSON.stringify(gifsResponse))
        const { data } = await gf.gifs('tv', 'thrillers')
        testDummyGif(data[0])
    })
    test('search', async () => {
        fetchMock.mockResponseOnce(JSON.stringify(gifsResponse))
        const { data } = await gf.search('dogs')
        testDummyGif(data[0])
    })
    test('subcategories', async () => {
        fetchMock.mockResponseOnce(JSON.stringify(categoriesResponse))
        const { data } = await gf.subcategories('tv ')
        expect(data[0].name).toBe(category.name)
        expect(data[0].name_encoded).toBe(category.name_encoded)
    })
    test('trending', async () => {
        fetchMock.mockResponseOnce(JSON.stringify(gifsResponse))
        const { data } = await gf.trending()
        testDummyGif(data[0])
    })
    test('random', async () => {
        fetchMock.mockResponseOnce(JSON.stringify(gifResponse))
        const { data } = await gf.random()
        testDummyGif(data)
    })
    test('related', async () => {
        fetchMock.mockResponseOnce(JSON.stringify(gifsResponse))
        const { data } = await gf.related('12345')
        testDummyGif(data[0])
    })
    test('related', async () => {
        fetchMock.mockResponseOnce(JSON.stringify(gifsResponse))
        const { data } = await gf.related('12345', { type: 'stickers' })
        testDummyGif(data[0])
    })
    test('emoji', async () => {
        fetchMock.mockResponseOnce(JSON.stringify(gifsResponse))
        const { data } = await gf.emoji()
        testDummyGif(data[0])
    })
    test('text search', async () => {
        fetchMock.mockResponseOnce(JSON.stringify(gifsResponse))
        const { data } = await gf.search('pasta', { type: 'text' })
        testDummyGif(data[0])
    })
    test('explore', async () => {
        fetchMock.mockResponseOnce(JSON.stringify(gifsResponse))
        const { data } = await gf.search('pasta', { explore: true })
        testDummyGif(data[0])
    })
    test('text trending', async () => {
        fetchMock.mockResponseOnce(JSON.stringify(gifsResponse))
        const { data } = await gf.trending({ type: 'text' })
        const [req] = fetchMock.mock.calls
        expect((req[0] as string).indexOf(`excludeDynamicResults`)).toEqual(-1)
        testDummyGif(data[0])
    })
    test('text search', async () => {
        fetchMock.mockResponseOnce(JSON.stringify(gifsResponse))
        const { data } = await gf.search('hi', { type: 'text' })
        const [req] = fetchMock.mock.calls
        expect((req[0] as string).indexOf(`excludeDynamicResults`)).toBeGreaterThan(-1)
        testDummyGif(data[0])
    })
    test('text animate', async () => {
        fetchMock.mockResponseOnce(JSON.stringify(gifsResponse))
        const { data } = await gf.animate('hi', { limit: 10 })
        testDummyGif(data[0])
    })
    test('response ok with message', async () => {
        fetchMock.mockResponseOnce(JSON.stringify(okResponseWithError), { status: 403 })
        try {
            await gf.related('d')
        } catch (error: any) {
            expect(error.message).toBe(`${ERROR_PREFIX}${okResponseWithError.message}`)
        }
    })
    test('error', async () => {
        fetchMock.mockResponses([JSON.stringify({}), { status: 400 }])
        try {
            await gf.related('12345 with error')
        } catch (error: any) {
            expect(error.status).toBe(400)
            expect(error.statusText).toBe('Bad Request')
            expect(error.message).toBe(`${ERROR_PREFIX}${DEFAULT_ERROR}`)
        }
    })
    test('error', async () => {
        fetchMock.mockReject(new Error('some crazy error'))
        try {
            await gf.related('some crazy error')
        } catch (error: any) {
            expect(error.message).toBe('some crazy error')
        }
    })

    test('synthetic response', async () => {
        fetchMock.mockResponseOnce(JSON.stringify(syntheticResponse))
        try {
            await gf.related('synthic error')
        } catch (error: any) {
            expect(error.message).toBe('synthetic response')
        }
    })

    test('synthetic response no meta', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({ ...syntheticResponse, meta: undefined }))
        try {
            await gf.related('synthic error no meta')
        } catch (error: any) {
            expect(error.message).toBe('synthetic response')
        }
    })
})
