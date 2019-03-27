import GiphyFetchAPI from '../api'
// @ts-ignore magically this defines types for fetchMock
// eslint-disable-next-line
import * as fetch from 'jest-fetch-mock'
import { IGif } from '@giphy/js-types'

const dummyGif = {
    id: 12345,
    tags: [{ text: 'text prop' }, 'regular tag'],
    is_hidden: 0,
}
const pagination = {}
const meta = {}
const gifsResponse = {
    data: [dummyGif],
    pagination,
    meta,
}
const gifResponse = {
    data: dummyGif,
    pagination,
    meta,
}

const category = { name: 'news & politics', name_encoded: 'news-politics' }
const categoriesResponse = {
    data: [category],
}
const gf = new GiphyFetchAPI('4OMJYpPoYwVpe')
const testDummyGif = (gif: IGif) => {
    expect(gif.id).toBe('12345')
    expect(gif.tags).toEqual(['text prop', 'regular tag'])
    expect(gif.is_hidden).toBe(false)
}
describe('response parsing', () => {
    beforeEach(() => {
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
    test('gifs', async () => {
        fetchMock.mockResponseOnce(JSON.stringify(gifsResponse))
        const { data } = await gf.gifs(['12345'])
        testDummyGif(data[0])
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
        const { data } = await gf.search('trending')
        testDummyGif(data[0])
    })
    test('random', async () => {
        fetchMock.mockResponseOnce(JSON.stringify(gifsResponse))
        const { data } = await gf.search('random')
        testDummyGif(data[0])
    })
    test('related', async () => {
        fetchMock.mockResponseOnce(JSON.stringify(gifsResponse))
        const { data } = await gf.related('12345')
        testDummyGif(data[0])
    })
})
