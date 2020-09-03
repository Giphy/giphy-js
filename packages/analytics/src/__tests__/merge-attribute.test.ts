import mergeAttribute from '../merge-attribute'

describe('merge pingback attribute', () => {
    test('no attributes', () => {
        expect(mergeAttribute([], 'hi')).toEqual([])
    })
    test('one attribute', () => {
        expect(
            mergeAttribute(
                [
                    {
                        key: 'hi',
                        value: 'hello',
                    },
                    {
                        key: 'bye',
                        value: 'goodbye',
                    },
                ],
                'hi'
            )
        ).toEqual([
            { key: 'bye', value: 'goodbye' },
            { key: 'hi', value: 'hello' },
        ])
    })

    test('merged attribute', () => {
        expect(
            mergeAttribute(
                [
                    {
                        key: 'hi',
                        value: 'hello',
                    },
                    {
                        key: 'hi',
                        value: 'bonjour',
                    },
                    {
                        key: 'bye',
                        value: 'goodbye',
                    },
                    {
                        key: 'bye',
                        value: 'au revoir',
                    },
                ],
                'hi'
            )
        ).toEqual([
            { key: 'bye', value: 'goodbye' },
            { key: 'bye', value: 'au revoir' },
            { key: 'hi', value: 'hello, bonjour' },
        ])
    })
})
