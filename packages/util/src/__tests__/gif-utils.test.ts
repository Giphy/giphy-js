import { getGifHeight } from '../gif-utils'
import { mapValues, forEach, take, without, pick } from '../collections'
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
    expect(mapValues(o, () => 100)).toEqual({ one: 100, two: 100 })
    expect(mapValues(o, (val: number) => val + 1)).toEqual({ one: 2, two: 3 })
    expect(mapValues(o, (val: any, key: any) => val + key)).toEqual({ one: `1one`, two: `2two` })
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
})
