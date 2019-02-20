import { h, render, Component } from 'preact'
import { throttle } from 'throttle-debounce'
import Grid from '../src/grid'
import { IGif } from '@giphy-js/types'

// to require json, we need to define require
declare function require(name: string): string

const gifs = require('./gifs.json')
const gifs2 = require('./gifs.2.json')

declare const module: any

const getWidth = () => innerWidth - 20
type State = {
    width: number
    gifs: IGif[]
}

type Props = {}

class Resizer extends Component<Props, State> {
    state = {
        width: getWidth(),
        gifs: [],
    }
    fetched: boolean
    setWidth = throttle(500, () => this.setState({ width: getWidth() }))
    fetchGifs = () => {
        if (!this.fetched) {
            this.fetched = true
            setTimeout(() => {
                this.setState({ gifs: [...gifs.data.gifs, ...gifs2.data.gifs] })
            }, 2000)
        }
    }
    componentDidMount() {
        window.addEventListener('resize', this.setWidth, false)
        setTimeout(() => {
            this.setState({ gifs: gifs.data.gifs })
        }, 1000)
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.setWidth, false)
    }

    render(_: Props, { width, gifs }) {
        return <Grid width={width} gifs={gifs} columns={3} gutter={6} fetchGifs={this.fetchGifs} />
    }
}

const mountNode = document.getElementById('root')!
render(<Resizer />, mountNode, mountNode.lastChild as Element)

// Hot Module Replacement
if (module.hot) {
    module.hot.accept()
}
