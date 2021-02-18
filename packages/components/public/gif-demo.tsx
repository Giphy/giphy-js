import { css } from '@emotion/css'
import { GiphyFetch } from '@giphy/js-fetch-api'
import { IGif } from '@giphy/js-types'
// @ts-ignore
import { h, Component, render as preactRender } from 'preact'
import { Gif, renderGif } from '../src'

const gf = new GiphyFetch('sXpGFDGZs0Dv1mmNFvYaGUvYwKX0PWIh')
const getEl = (targetEl: HTMLElement, selector: string): HTMLElement => {
    let componentTarget = targetEl.querySelector(`.${selector}`)
    if (!componentTarget) {
        componentTarget = document.createElement('div')
        componentTarget.className = selector
        targetEl.appendChild(componentTarget)
    }
    return componentTarget as HTMLElement
}
export const vanillaJSGif = async (targetEl: HTMLElement) => {
    // target all gifs by Gif.className
    targetEl.className = css`
        .${Gif.className} {
            margin-right: 6px;
        }
    `
    // render a gif
    const { data: gif1 } = await gf.gif('fpXxIjftmkk9y')
    renderGif({ gif: gif1, width: 300 }, getEl(targetEl, 'gif1'))
    // render another gif
    const { data: gif2 } = await gf.gif('1DqOFqULOqe5y')
    renderGif({ gif: gif2, width: 300, className: 'gif-1DqOFqULOqe5y' }, getEl(targetEl, 'gif2'))
}

export namespace PreactGif {
    type Props = {}
    type State = { gif: undefined | IGif; gif2: undefined | IGif }
    const containerCss = css`
        display: flex;
    `
    class Test extends Component<Props, State> {
        state: State = {
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

        render(_: Props, { gif, gif2 }: State) {
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
