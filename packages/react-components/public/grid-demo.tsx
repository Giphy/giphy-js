import { GiphyFetch } from '@giphy/js-fetch-api'
import { css } from 'emotion'
import React, { PureComponent } from 'react'
import { throttle } from 'throttle-debounce'
import { Grid, GifOverlayProps } from '../src'

const getWidth = () => innerWidth

const gf = new GiphyFetch('sXpGFDGZs0Dv1mmNFvYaGUvYwKX0PWIh')
const fetchGifs = (offset: number) => gf.trending({ offset, limit: 10 })

type State = {
    width: number
}
type Props = {}

const overlayCss = css`
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    display: flex;
    color: white;
    justify-content: center;
    align-items: center;
`

const Overlay = ({ gif, isHovered }: GifOverlayProps) => <div className={overlayCss}>{isHovered ? gif.id : ''}</div>

class GridDemo extends PureComponent<Props, State> {
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

    render() {
        const { width } = this.state
        return <Grid width={width} columns={width < 500 ? 2 : 3} gutter={6} fetchGifs={fetchGifs} overlay={Overlay} />
    }
}

export default GridDemo
