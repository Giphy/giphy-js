import { PingbackEventType } from '@giphy/js-analytics'
import { IGif, IUser } from '@giphy/js-types'
import { getGifWidth } from '@giphy/js-util'
import { css, cx } from 'emotion'
import { Component, h } from 'preact'
import Observer from '../util/observer'
import * as pingback from '../util/pingback'
import Gif, { EventProps } from './gif'
import Loader from './loader'

const carouselCss = css`
    -webkit-overflow-scrolling: touch;
    overflow-x: auto;
    white-space: nowrap;
    position: relative;
`
const carouselItemCss = css`
    display: inline-block;
    list-style: none;
    &:first-of-type {
        margin-left: 0px;
    }
`

const loaderContainerCss = css`
    display: inline-block;
`

const loaderCss = css`
    width: 30px;
    height: 100%;
    display: inline-block;
`

export const className = 'giphy-carousel' // used in preact render
type GridProps = {
    gifs: IGif[]
    user: Partial<IUser>
    gifHeight: number
    gutter: number
    pingbackEventType: PingbackEventType
    fetchGifs?: () => void
}

type Props = GridProps & EventProps

type State = { isFetching: boolean; numberOfGifs: number }
class Carousel extends Component<Props, State> {
    state = {
        isFetching: false,
        numberOfGifs: 0,
    }
    el?: HTMLElement
    static getDerivedStateFromProps({ gifs }: Props, prevState: State) {
        if (gifs.length > prevState.numberOfGifs) {
            return { isFetching: false, numberOfGifs: gifs.length }
        }
        return null
    }
    onGifSeen = (gif: IGif, boundingClientRect: ClientRect | DOMRect) => {
        const { onGifSeen, pingbackEventType, user } = this.props
        if (onGifSeen) {
            onGifSeen(gif, boundingClientRect)
        }
        // fire pingback
        pingback.onGifSeen(gif, user, pingbackEventType, boundingClientRect)
    }
    onGifClick = (gif: IGif, e: Event) => {
        const { onGifClick, pingbackEventType, user } = this.props
        if (onGifClick) {
            onGifClick(gif, e)
        }
        pingback.onGifClick(gif, user, pingbackEventType, e)
    }
    onGifHover = (gif: IGif, e: Event) => {
        const { onGifHover, pingbackEventType, user } = this.props
        if (onGifHover) {
            onGifHover(gif, e)
        }
        pingback.onGifHover(gif, user, pingbackEventType, e)
    }
    fetchGifs = () => {
        const { fetchGifs } = this.props
        const { isFetching } = this.state
        if (!isFetching && fetchGifs) {
            this.setState({ isFetching: true })
            fetchGifs()
        }
    }

    render({ gifs, fetchGifs, onGifVisible, onGifRightClick, gifHeight, gutter = 6 }: Props) {
        const showLoader = fetchGifs && gifs.length > 0
        const marginCss = css`
            margin-left: ${gutter}px;
        `
        const containerHeightCss = css`
            height: ${gifHeight}px;
        `
        // className is for preact, set the height based on the prop in containerHeightCss
        const containerCss = cx(className, containerHeightCss, carouselCss)
        const gifCss = cx(carouselItemCss, marginCss)
        return (
            <div class={containerCss}>
                {gifs.map(gif => {
                    const gifWidth = getGifWidth(gif, gifHeight)
                    return (
                        <Gif
                            className={gifCss}
                            gif={gif}
                            key={gif.id}
                            width={gifWidth}
                            onGifClick={this.onGifClick}
                            onGifHover={this.onGifHover}
                            onGifSeen={this.onGifSeen}
                            onGifVisible={onGifVisible}
                            onGifRightClick={onGifRightClick}
                        />
                    )
                })}
                {showLoader && (
                    <Observer className={loaderContainerCss}>
                        <Loader fetchGifs={this.fetchGifs} className={loaderCss} />
                    </Observer>
                )}
            </div>
        )
    }
}

export default Carousel
