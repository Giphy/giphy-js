import { renderGif, Gif } from '../src'
import { h, render as preactRender, Component } from 'preact'
import { GiphyFetch } from '@giphy/js-fetch-api'
import { IGif } from '@giphy/js-types'
import { css } from 'emotion'

const gf = new GiphyFetch('sXpGFDGZs0Dv1mmNFvYaGUvYwKX0PWIh')
export const vanillaJSGif = async (targetEl: HTMLElement) => {
    // target all gifs by Gif.className
    targetEl.className = css`
        .${Gif.className} {
            display: inline-block;
        }
    `
    const { data: gif1 } = await gf.gif('fpXxIjftmkk9y')
    // no className prop will merge props with an existing Gif using the default className
    renderGif({ gif: gif1, width: 300 }, targetEl)
    const { data: gif2 } = await gf.gif('1DqOFqULOqe5y')
    // create new gifs in a targetEl by providing a unique className prop
    renderGif({ gif: gif2, width: 300, className: 'gif-1DqOFqULOqe5y' }, targetEl)
}

export namespace PreactGif {
    type Props = {}
    const containerCss = css`
        display: flex;
    `
    class Test extends Component<Props, { gif: undefined | IGif; gif2: undefined | IGif }> {
        state = {
            gif: undefined,
            gif2: undefined,
        }
        async componentDidMount() {
            const [{ data: gif }, { data: gif2 }] = await Promise.all([
                gf.gif('fpXxIjftmkk9y'),
                gf.gif('1DqOFqULOqe5y'),
            ])
            this.setState({ gif, gif2 })
        }
        render(_: Props, { gif, gif2 }) {
            return gif ? (
                <div className={containerCss}>
                    <Gif gif={gif} width={300} />
                    <Gif gif={gif2} width={300} />
                </div>
            ) : null
        }
    }

    export const render = (mountNode: HTMLElement) => preactRender(<Test />, mountNode, mountNode.lastChild as Element)
}
