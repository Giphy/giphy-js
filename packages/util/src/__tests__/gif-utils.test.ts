import { getGifHeight } from '../gif-utils'

test('getGifHeight', () => {
    const gif = {
        images: {
            fixed_width: {
                width: 10,
                height: 10,
            },
        },
    }
    expect(getGifHeight(gif, 50)).toBe(50)
})
