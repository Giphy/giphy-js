import { gifPaginator, GifsResult } from '@giphy/js-fetch-api'
import { debounce } from 'throttle-debounce'
import { IGif, IUser } from '@giphy/js-types'
import { getGifWidth } from '@giphy/js-util'
import { css, cx } from 'emotion'
import { Component, h } from 'preact'
import Observer from '../util/observer'
import * as pingback from '../util/pingback'
import Gif, { EventProps } from './gif'

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
type Props = {
    user: Partial<IUser>
    gifHeight: number
    gutter: number
    fetchGifs: (offset: number) => Promise<GifsResult>
    onGifsFetched?: (gifs: IGif[]) => void
} & EventProps

type State = {
    isFetching: boolean
    numberOfGifs: number
    gifs: IGif[]
    isLoaderVisible: boolean
}
class Carousel extends Component<Props, State> {
    state = {
        isFetching: false,
        numberOfGifs: 0,
        gifs: [],
        isLoaderVisible: true,
    }
    el?: HTMLElement
    paginator: () => Promise<IGif[]>
    constructor(props: Props) {
        super(props)
        // create a paginator
        this.paginator = gifPaginator(props.fetchGifs)
    }
    componentDidMount() {
        this.onFetch()
    }
    onGifSeen = (gif: IGif, boundingClientRect: ClientRect | DOMRect) => {
        const { onGifSeen, user } = this.props
        if (onGifSeen) {
            onGifSeen(gif, boundingClientRect)
        }
        // fire pingback
        pingback.onGifSeen(gif, user, boundingClientRect)
    }
    onGifClick = (gif: IGif, e: Event) => {
        const { onGifClick, user } = this.props
        if (onGifClick) {
            onGifClick(gif, e)
        }
        pingback.onGifClick(gif, user, e)
    }
    onGifHover = (gif: IGif, e: Event) => {
        const { onGifHover, user } = this.props
        if (onGifHover) {
            onGifHover(gif, e)
        }
        pingback.onGifHover(gif, user, e)
    }
    onLoaderVisible = (isVisible: boolean) => {
        this.setState({ isLoaderVisible: isVisible }, this.onFetch)
    }
    onFetch = debounce(100, async () => {
        const { isFetching, isLoaderVisible } = this.state
        if (!isFetching && isLoaderVisible) {
            this.setState({ isFetching: true })
            const gifs = await this.paginator()
            this.setState({ gifs, isFetching: false })
            const { onGifsFetched } = this.props
            if (onGifsFetched) onGifsFetched(gifs)
            this.onFetch()
        }
    })
    render({ fetchGifs, onGifVisible, onGifRightClick, gifHeight, gutter = 6 }: Props, { gifs }: State) {
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
                    <Observer className={loaderContainerCss} onVisibleChange={this.onLoaderVisible}>
                        <div className={loaderCss} />
                    </Observer>
                )}
            </div>
        )
    }
}

export default Carousel
