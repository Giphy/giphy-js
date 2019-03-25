import { throttle } from 'throttle-debounce'
import { renderGrid, Grid } from '../src'
import { IGif } from '@giphy/js-types'
import { h, render as preactRender, Component } from 'preact'
import { GiphyFetch } from '@giphy/js-fetch-api'
import { GifsResult } from '../../fetch-api/dist/result-types'

const columns = 3
const gutter = 6

const mountNode = document.getElementById('root')!

const getWidth = () => innerWidth - 20

const giphyFetch = (offset: number) => {
    const gf = new GiphyFetch('4OMJYpPoYwVpe')
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
                    columns={3}
                    gutter={6}
                    fetchGifs={this.fetchGifs}
                    pingbackEventType="GIF_SEARCH"
                />
            )
        }
    }

    // eslint-disable-next-line
    export const render = () => preactRender(<Test />, mountNode, mountNode.lastChild as Element)
}

namespace Vanilla {
    let renderGifs: IGif[] = []
    let offset = 0
    let inited = false
    document.title = 'Vanilla Grid Wrapper'
    const fetchGifs = async () => {
        const result = await giphyFetch(offset)
        const { pagination } = result as GifsResult
        offset = pagination.count + pagination.offset
        renderGifs = renderGifs.concat((result as GifsResult).data)
        render()
    }
    const init = () => {
        if (inited) return
        inited = true
        const setWidth = throttle(500, render)
        window.addEventListener('resize', setWidth, false)
        fetchGifs()
    }
    // eslint-disable-next-line
    export const render = () => {
        init()
        const width = getWidth()
        renderGrid(
            {
                width,
                gifs: renderGifs,
                user: {},
                columns,
                gutter,
                fetchGifs,
                pingbackEventType: 'GIF_CHANNEL',
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

location.search.indexOf('preact') !== -1 ? Preact.render() : Vanilla.render()
