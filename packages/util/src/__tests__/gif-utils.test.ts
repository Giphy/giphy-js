import { IGif, IImages, ImageAllTypes, IUser } from '@giphy/js-types'
import { forEach, mapValues, pick, take, without } from '../collections'
import getPingbackId from '../get-pingback-id'
import { getAltText, getBestRenditionUrl, getGifHeight, getGifWidth, getSpecificRendition } from '../gif-utils'

describe('response parsing', () => {
    test('getGifHeight getGifWidth', () => {
        const gif = {
            images: {
                fixed_width: {
                    width: 10,
                    height: 100,
                },
            },
        }
        expect(getGifHeight(gif as IGif, 50)).toBe(500)
        expect(getGifHeight({ images: {} } as IGif, 50)).toBe(0)
        expect(getGifWidth(gif as IGif, 50)).toBe(5)
        expect(getGifWidth({ images: {} } as IGif, 50)).toBe(0)
    })

    test('getAltText', () => {
        expect(getAltText({ title: 'title' } as IGif)).toBe(`title`)
        const user: Partial<IUser> = {
            username: 'jester',
        }
        const dummyGif: Partial<IGif> = {
            id: 12345,
            user: user as IUser,
            tags: ['hi', 'bye', 'transparent'],
        }
        expect(getAltText(dummyGif as IGif)).toBe(`${user.username} hi bye GIF`)
        const dummyGifNoUser: Partial<IGif> = {
            id: 12345,
            tags: ['hi', 'bye', 'hola', 'adios', 'bonjour', 'au revoir', 'ciao', 'arrivederci'],
        }
        expect(getAltText(dummyGifNoUser as IGif)).toBe(`hi bye hola adios bonjour GIF`)
        const dummySticker: Partial<IGif> = {
            id: 12345,
            is_sticker: true,
            tags: ['hi', 'bye', 'hola', 'adios', 'bonjour', 'au revoir', 'ciao', 'arrivederci'],
        }
        expect(getAltText(dummySticker as IGif)).toBe(`hi bye hola adios bonjour Sticker`)
    })

    test('getBestRenditionUrl', () => {
        const fixedWidth: Partial<ImageAllTypes> = {
            width: 10,
            height: 10,
            url: 'fixed_width url',
            webp: 'fixed_width webp',
            mp4: 'fixed_width mp4',
        }
        const fixedWidthStill: Partial<ImageAllTypes> = {
            width: 10,
            height: 10,
            url: 'fixed_width url still',
            webp: 'fixed_width_still webp',
            mp4: 'fixed_width mp4?',
        }
        const images: Partial<IImages> = {
            fixed_width: fixedWidth as ImageAllTypes,
            fixed_width_still: fixedWidthStill as ImageAllTypes,
        }
        const dummyGif: Partial<IGif> = {
            images: images as IImages,
        }
        expect(getBestRenditionUrl(dummyGif as IGif, 10, 10)).toBe(fixedWidth.url)
        expect(getBestRenditionUrl(dummyGif as IGif, 10, 10, { isStill: true })).toBe(fixedWidthStill.url)
        expect(getBestRenditionUrl(dummyGif as IGif, 10, 10, { useVideo: true })).toBe(fixedWidth.mp4)
        expect(getBestRenditionUrl(dummyGif as IGif, 10, 10)).toBe(fixedWidth.url)
        expect(getBestRenditionUrl(dummyGif as IGif, 10, 10, { isStill: true })).toBe(fixedWidthStill.url)
    })

    test('getSpecificRendition', () => {
        const fixedWidth: Partial<ImageAllTypes> = {
            width: 10,
            height: 10,
            url: 'fixed_width url',
            webp: 'fixed_width webp',
            mp4: 'fixed_width mp4',
        }
        const fixedWidthStill: Partial<ImageAllTypes> = {
            width: 10,
            height: 10,
            url: 'fixed_width url still',
            webp: 'fixed_width_still webp',
            mp4: 'fixed_width mp4?',
        }
        const images: Partial<IImages> = {
            fixed_width: fixedWidth as ImageAllTypes,
            fixed_width_still: fixedWidthStill as ImageAllTypes,
        }
        const dummyGif: Partial<IGif> = {
            images: images as IImages,
        }
        expect(getSpecificRendition(dummyGif as IGif, 'fixed_width')).toBe(fixedWidth.url)
        expect(getSpecificRendition(dummyGif as IGif, 'fixed_width', true)).toBe(fixedWidthStill.url)
        expect(getSpecificRendition(dummyGif as IGif, 'fixed_width', true, true)).toBe(fixedWidth.mp4)
        expect(getSpecificRendition(dummyGif as IGif, 'fixed_width_still', true, true)).toBe(fixedWidthStill.mp4)
        expect(getSpecificRendition(dummyGif as IGif, 'fixed_width')).toBe(fixedWidth.url)
        expect(getSpecificRendition(dummyGif as IGif, 'dsakfjslkj')).toBe('')
        expect(getSpecificRendition({} as IGif, 'fixed_width')).toBe('')
    })
})

describe('collections', () => {
    test('object map', () => {
        const o = Object.freeze({ one: 1, two: 2 })
        expect(mapValues(o, () => 100)).toEqual({ one: 100, two: 100 })
        expect(mapValues(o, (val: number) => val + 1)).toEqual({ one: 2, two: 3 })
        expect(mapValues(o, (val: any, key: any) => val + key)).toEqual({ one: `1one`, two: `2two` })
        try {
            expect(mapValues([], (val: any, key: any) => val + key)).toEqual({ one: `1one`, two: `2two` })
        } catch (error) {
            expect(true).toBe(true)
        }
    })

    test('object forEach', () => {
        const o = Object.freeze({ one: 1, two: 2 })
        forEach(o, (val: number, key: string) => {
            switch (key) {
                case 'one':
                    expect(val).toBe(1)
                    break
                default:
                    expect(val).toBe(2)
                    break
            }
        })

        try {
            expect(forEach([], (val: any, key: any) => val + key)).toEqual({ one: `1one`, two: `2two` })
        } catch (error) {
            expect(true).toBe(true)
        }
    })

    test('array take', () => {
        const test = ['a', 'b', 'c']
        expect(take(test, 1)).toEqual(['a'])
        expect(take(test, 2)).toEqual(['a', 'b'])
        expect(take(test, 5)).toEqual(['a', 'b', 'c'])
    })

    test('array without', () => {
        const test = ['a', 'b', 'c']
        expect(without(test, ['c', 'b'])).toEqual(['a'])
        expect(without(test, ['c'])).toEqual(['a', 'b'])
        expect(without(test, ['sfsdfs'])).toEqual(['a', 'b', 'c'])
    })

    test('object pick', () => {
        const o = Object.freeze({ one: 1, two: 2 })
        const res = pick(o, ['one'])
        expect(res).toEqual({ one: 1 })
        // @ts-ignore
        const unmatchedProperty = pick({ g: 123 }, ['b'])
        expect(unmatchedProperty).toEqual({})
    })

    test('getRandomId', () => {
        const id = getPingbackId()
        expect(id.length).toEqual(16)
    })
})
