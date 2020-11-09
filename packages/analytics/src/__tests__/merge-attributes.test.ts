import mergeAttributes from '../merge-attributes'

describe('merge pingback attribute', () => {
    test('no attributes', () => {
        expect(mergeAttributes({}, {}, 'hi')).toEqual({})
    })
    test('one attribute', () => {
        expect(
            mergeAttributes(
                {
                    hi: 'hello',
                },
                {
                    bye: 'goodbye',
                },
                'hi'
            )
        ).toEqual({ bye: 'goodbye', hi: 'hello' })
    })

    test('merged attribute', () => {
        expect(
            mergeAttributes(
                {
                    hi: 'hello',
                    bye: 'goodbye',
                },
                {
                    hi: 'bonjour',
                },
                'hi'
            )
        ).toEqual({ bye: 'goodbye', hi: 'hello, bonjour' })
    })
})
