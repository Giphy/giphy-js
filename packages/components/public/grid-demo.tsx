import { GiphyFetch } from '@giphy/js-fetch-api'
import { Component, h, render as preactRender } from 'preact' // eslint-disable-line no-unused-vars
import { throttle } from 'throttle-debounce'
import { Grid, renderGrid } from '../src'

const getWidth = () => innerWidth
const gf = new GiphyFetch('sXpGFDGZs0Dv1mmNFvYaGUvYwKX0PWIh')
const fetchGifs = (offset: number) => gf.trending({ offset, limit: 10 })

// eslint-disable-next-line @typescript-eslint/no-unused-expressions
h

export namespace PreactGrid {
    type State = {
        width: number
        term: string
    }
    type Props = {}
    class Test extends Component<Props, State> {
        state = {
            width: getWidth(),
            term: '',
        }

        offset = 0
        setWidth = throttle(500, () => this.setState({ width: getWidth() }))
        componentDidMount() {
            window.addEventListener('resize', this.setWidth, false)
        }

        componentWillUnmount() {
            window.removeEventListener('resize', this.setWidth, false)
        }

        render(_: Props, { width, term }) {
            const NoResults = <div>No results for {term}</div>
            const fetchGifs = (offset: number) => gf.search(term, { offset, limit: 10 })
            return (
                <div>
                    <input
                        style={{ margin: 10 }}
                        placeholder="type to search"
                        onInput={({ target: { value } }) => this.setState({ term: value })}
                        value={term}
                    />
                    {term && (
                        <div key={term}>
                            <Grid
                                width={width}
                                columns={width < 500 ? 2 : 3}
                                gutter={6}
                                noResultsMessage={NoResults}
                                fetchGifs={fetchGifs}
                            />
                        </div>
                    )}
                </div>
            )
        }
    }

    export const render = (mountNode: HTMLElement) => preactRender(<Test />, mountNode, mountNode.lastChild as Element)
}

export class VanillaJSGrid {
    mountNode: HTMLElement
    el: HTMLElement
    constructor(mountNode: HTMLElement) {
        this.mountNode = mountNode
        const resizeRender = throttle(500, () => this.render())
        window.addEventListener('resize', resizeRender, false)
        this.render()
    }

    render = () => {
        const width = getWidth()
        this.remove = renderGrid(
            {
                width,
                fetchGifs,
                columns: width < 500 ? 2 : 3,
                gutter: 6,
            },
            this.mountNode
        )
    }

    remove() {
        this.remove()
    }
}

export const vanillaJSGrid = (mountNode: HTMLElement) => {
    const render = () => {
        const width = getWidth()
        return renderGrid(
            {
                width,
                fetchGifs,
                columns: width < 500 ? 2 : 3,
                gutter: 6,
                onGifsFetchError: (error) => console.error(`Gif Grid fetch error`, error),
            },
            mountNode
        )
    }
    const resizeRender = throttle(500, render)
    window.addEventListener('resize', resizeRender, false)
    const remove = render()
    return () => {
        remove()
        window.removeEventListener('resize', resizeRender, false)
    }
}
