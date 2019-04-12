import { Carousel, renderCarousel } from '../src'
import { IGif } from '@giphy/js-types'
import { h, render as preactRender, Component } from 'preact'
import { GiphyFetch, GifsResult } from '@giphy/js-fetch-api'

const giphyFetch = (offset: number) => {
    const gf = new GiphyFetch('eDs1NYmCVgdHvI1x0nitWd5ClhDWMpRE')
    return gf.trending({ offset, limit: 4 })
}

export namespace PreactCarousel {
    type State = {
        gifs: IGif[]
    }
    type Props = {}
    class Test extends Component<Props, State> {
        state = {
            gifs: [],
        }
        offset = 0
        fetchGifs = async () => {
            const result = await giphyFetch(this.offset)
            const { gifs } = this.state
            const { pagination } = result as GifsResult
            this.offset = pagination.count + pagination.offset
            this.setState({ gifs: [...gifs, ...(result as GifsResult).data] })
        }
        componentDidMount() {
            this.fetchGifs()
        }
        render(_: Props, { gifs }) {
            return (
                <Carousel
                    gifHeight={200}
                    user={{}}
                    gifs={gifs}
                    gutter={6}
                    fetchGifs={this.fetchGifs}
                    pingbackEventType="GIF_SEARCH"
                />
            )
        }
    }

    export const render = mountNode => preactRender(<Test />, mountNode, mountNode.lastChild as Element)
}

export const vanillaJSCarousel = (mountNode: HTMLElement) => {
    let gifs: IGif[] = []
    let offset = 0
    const fetchGifs = async () => {
        const result = await giphyFetch(offset)
        const { pagination } = result as GifsResult
        offset = pagination.count + pagination.offset
        gifs = [...gifs, ...(result as GifsResult).data]
        render()
    }
    const onGifClick = (gif: IGif) => {
        window.open(gif.url)
    }
    const render = () => {
        renderCarousel(
            {
                gifHeight: 200,
                onGifClick,
                fetchGifs,
                gifs,
                user: {},
                gutter: 6,
                pingbackEventType: 'GIF_RELATED',
            },
            mountNode,
        )
    }
    fetchGifs()
}
