import { throttle } from 'throttle-debounce'
import { renderGrid, Grid } from '../src'
import { IGif } from '@giphy/js-types'
import { h, render as preactRender, Component } from 'preact'
import { GiphyFetch, GifsResult } from '@giphy/js-fetch-api'

const mountNode = document.getElementById('root')!

const getWidth = () => innerWidth

const giphyFetch = (offset: number) => {
    const gf = new GiphyFetch('eDs1NYmCVgdHvI1x0nitWd5ClhDWMpRE')
    return gf.trending({ offset })
}

namespace Preact {
    type State = {
        width: number
        gifs: IGif[]
    }

    type Props = {}

    class Test extends Component<Props, State> {
        state = {
            width: getWidth(),
            gifs: [],
        }
        offset = 0
        setWidth = throttle(500, () => this.setState({ width: getWidth() }))
        fetchGifs = async () => {
            const result = await giphyFetch(this.offset)

            const { gifs } = this.state
            const { pagination } = result as GifsResult
            this.offset = pagination.count + pagination.offset
            this.setState({ gifs: [...gifs, ...(result as GifsResult).data] })
            render()
        }
        componentDidMount() {
            document.title = 'Preact Grid Wrapper'
            window.addEventListener('resize', this.setWidth, false)
            this.fetchGifs()
        }
        componentWillUnmount() {
            window.removeEventListener('resize', this.setWidth, false)
        }

        render(_: Props, { width, gifs }) {
            return (
                <Grid
                    width={width}
                    user={{}}
                    gifs={gifs}
                    columns={width < 500 ? 2 : 3}
                    gutter={6}
                    fetchGifs={this.fetchGifs}
                    pingbackEventType="GIF_SEARCH"
                />
            )
        }
    }

    export const render = () => preactRender(<Test />, mountNode, mountNode.lastChild as Element)
}

class VanillaJS {
    gifs: IGif[] = []
    offset = 0
    constructor() {
        const resizeRender = throttle(500, () => this.render())
        window.addEventListener('resize', resizeRender as any, false)
        this.fetchGifs()
    }
    fetchGifs = async () => {
        const result = await giphyFetch(this.offset)
        const { pagination } = result as GifsResult
        this.offset = pagination.count + pagination.offset
        this.gifs = [...this.gifs, ...(result as GifsResult).data]
        this.render()
    }
    onGifClick = (gif: IGif) => {
        window.open(gif.url)
    }
    render = () => {
        const { gifs, onGifClick, fetchGifs } = this
        const width = getWidth()
        renderGrid(
            {
                width,
                onGifClick,
                fetchGifs,
                gifs,
                user: {},
                columns: width < 500 ? 2 : 3,
                gutter: 6,
                pingbackEventType: 'GIF_RELATED',
            },
            mountNode,
        )
    }
}

declare const module: any
// Hot Module Replacement
if (module.hot) {
    module.hot.accept()
}

location.search.indexOf('preact') !== -1 ? Preact.render() : new VanillaJS()
