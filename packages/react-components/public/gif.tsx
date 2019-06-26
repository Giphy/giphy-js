import { GiphyFetch } from '@giphy/js-fetch-api'
import { IGif } from '@giphy/js-types'
import { css } from 'emotion'
import React, { PureComponent } from 'react'
import { Gif } from '../src'

const gf = new GiphyFetch('sXpGFDGZs0Dv1mmNFvYaGUvYwKX0PWIh')

type Props = {}
const containerCss = css`
    display: flex;
`
class GifShowcase extends PureComponent<Props, { gif: undefined | IGif; gif2: undefined | IGif }> {
    state = {
        gif: undefined,
        gif2: undefined,
    }
    async componentDidMount() {
        const [{ data: gif }, { data: gif2 }] = await Promise.all([gf.gif('fpXxIjftmkk9y'), gf.gif('1DqOFqULOqe5y')])
        this.setState({ gif, gif2 })
    }
    render() {
        const { gif, gif2 } = this.state
        return gif ? (
            <div className={containerCss}>
                <Gif gif={gif} width={300} />
                <Gif gif={gif2} width={300} />
            </div>
        ) : null
    }
}

export default GifShowcase
