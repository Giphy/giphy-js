import { GiphyFetch } from '@giphy/js-fetch-api'
import React, { PureComponent } from 'react'
import { throttle } from 'throttle-debounce'
import { Grid } from '../src'

const getWidth = () => innerWidth

const gf = new GiphyFetch('sXpGFDGZs0Dv1mmNFvYaGUvYwKX0PWIh')
const fetchGifs = (offset: number) => gf.trending({ offset, limit: 10 })

type State = {
    width: number
}
type Props = {}
class GridShowcase extends PureComponent<Props, State> {
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
        return <Grid width={width} columns={width < 500 ? 2 : 3} gutter={6} fetchGifs={fetchGifs} />
    }
}

export default GridShowcase
