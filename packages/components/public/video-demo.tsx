import { GiphyFetch } from '@giphy/js-fetch-api'
import { IGif } from '@giphy/js-types'
import { css } from '@emotion/css'
import { Component, render as preactRender, h } from 'preact'
import { renderVideo, Video } from '../src'

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
export const vanillaJSVideo = async (targetEl: HTMLElement) => {
    // target all gifs by Gif.className
    targetEl.className = css`
        .${Video.className} {
            margin-right: 6px;
        }
    `
    // render a gif
    const { data } = await gf.gif('D068R9Ziv1iCjezKzG')
    renderVideo({ gif: data, width: 300, controls: true }, getEl(targetEl, 'gif1'))
}

export namespace PreactVideo {
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
            const [{ data: gif }, { data: gif2 }] = await Promise.all([gf.gif('D068R9Ziv1iCjezKzG')])
            this.setState({ gif, gif2 })
        }

        render(_: Props, { gif }: State) {
            return gif ? (
                <div className={containerCss}>
                    <Video gif={gif} width={300} controls />
                </div>
            ) : null
        }
    }

    export const render = (mountNode: HTMLElement) => preactRender(<Test />, mountNode, mountNode.lastChild as Element)
}
