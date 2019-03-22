import { getGifHeight } from '../gif-utils'
import { mapObject } from '../collections'
import { IGif } from '@giphy/js-types'

test('getGifHeight', () => {
    const gif = {
        images: {
            fixed_width: {
                width: 10,
                height: 10,
            },
        },
    }
    expect(getGifHeight(gif as IGif, 50)).toBe(50)
})

test('object map', () => {
    const o = Object.freeze({ one: 1, two: 2 })
    expect(mapObject(o, () => 100)).toEqual({ one: 100, two: 100 })
    expect(mapObject(o, val => val + 1)).toEqual({ one: 2, two: 3 })
    expect(mapObject(o, (val, key) => val + key)).toEqual({ one: `1one`, two: `2two` })
})
