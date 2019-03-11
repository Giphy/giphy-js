import { getGifHeight } from '../gif-utils'
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
