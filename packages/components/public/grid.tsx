import { throttle } from 'throttle-debounce'
import { renderGrid, Grid } from '../src'
import { h, render as preactRender, Component } from 'preact'
import { GiphyFetch } from '@giphy/js-fetch-api'

const getWidth = () => innerWidth

const gf = new GiphyFetch('eDs1NYmCVgdHvI1x0nitWd5ClhDWMpRE')
const fetchGifs = (offset: number) => gf.trending({ offset, limit: 3 })

export namespace PreactGrid {
    type State = {
        width: number
    }
    type Props = {}
    class Test extends Component<Props, State> {
        state = {
            width: getWidth(),
        }
        offset = 0
        setWidth = throttle(500, () => this.setState({ width: getWidth() }))
        componentDidMount() {
            window.addEventListener('resize', this.setWidth, false)
        }
        componentWillUnmount() {
            window.removeEventListener('resize', this.setWidth, false)
        }
        render(_: Props, { width }) {
            return <Grid width={width} user={{}} columns={width < 500 ? 2 : 3} gutter={6} fetchGifs={fetchGifs} />
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
        window.addEventListener('resize', resizeRender as any, false)
        this.render()
    }
    render = () => {
        const width = getWidth()
        this.el = renderGrid(
            {
                width,
                fetchGifs,
                user: {},
                columns: width < 500 ? 2 : 3,
                gutter: 6,
            },
            this.mountNode,
        ) as HTMLElement
    }
    remove() {
        this.el.parentNode.removeChild(this.el)
    }
}
