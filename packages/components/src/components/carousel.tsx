import { gifPaginator, GifsResult } from '@giphy/js-fetch-api'
import { IGif, IUser } from '@giphy/js-types'
import { getGifWidth } from '@giphy/js-util'
import { css, cx } from 'emotion'
import { Component, h, JSX } from 'preact'
import { debounce } from 'throttle-debounce'
import Observer from '../util/observer'
import Gif, { EventProps } from './gif'
import PingbackContextManager from './pingback-context-manager'

const carouselCss = css`
    -webkit-overflow-scrolling: touch;
    overflow-x: auto;
    overflow-y: hidden;
    white-space: nowrap;
    position: relative;
`
const carouselItemCss = css`
    display: inline-block;
    list-style: none;
    /* make sure gifs are fully visible with a scrollbar */
    margin-bottom: 1px;
    &:first-of-type {
        margin-left: 0;
    }
`

const loaderContainerCss = css`
    display: inline-block;
`

const loaderCss = css`
    width: 30px;
    display: inline-block;
`

type Props = {
    className?: string
    user: Partial<IUser>
    gifHeight: number
    gifWidth?: number
    gutter: number
    fetchGifs: (offset: number) => Promise<GifsResult>
    onGifsFetched?: (gifs: IGif[]) => void
    noResultsMessage?: string | JSX.Element
    hideAttribution?: boolean
    noLink?: boolean
    tabIndex?: number
    borderRadius?: number
} & EventProps

const defaultProps = Object.freeze({ gutter: 6, user: {} })

type State = {
    isFetching: boolean
    numberOfGifs: number
    gifs: IGif[]
    isLoaderVisible: boolean
    isDoneFetching: boolean
}
const initialState = Object.freeze({
    isFetching: false,
    numberOfGifs: 0,
    gifs: [] as IGif[],
    isLoaderVisible: true,
    isDoneFetching: false,
})

class Carousel extends Component<Props, State> {
    static className = 'giphy-carousel'
    static readonly defaultProps = defaultProps
    readonly state = initialState
    el?: HTMLElement
    paginator = gifPaginator(this.props.fetchGifs)
    componentDidMount() {
        this.onFetch()
    }

    onLoaderVisible = (isVisible: boolean) => {
        this.setState({ isLoaderVisible: isVisible }, this.onFetch)
    }

    onFetch = debounce(100, async () => {
        const { isFetching, isLoaderVisible, gifs: existingGifs } = this.state
        if (!isFetching && isLoaderVisible) {
            this.setState({ isFetching: true })
            let gifs
            try {
                gifs = await this.paginator()
            } catch (error) {
                this.setState({ isFetching: false })
            }
            if (gifs) {
                if (existingGifs.length === gifs.length) {
                    this.setState({ isDoneFetching: true })
                } else {
                    this.setState({ gifs, isFetching: false })
                    const { onGifsFetched } = this.props
                    if (onGifsFetched) onGifsFetched(gifs)
                    this.onFetch()
                }
            }
        }
    })

    render(
        {
            onGifVisible,
            onGifRightClick,
            gifHeight,
            gifWidth,
            gutter,
            className = Carousel.className,
            onGifClick,
            onGifHover,
            onGifKeyPress,
            onGifSeen,
            user,
            noResultsMessage,
            hideAttribution,
            noLink,
            tabIndex = 0,
            borderRadius,
        }: Props,
        { gifs }: State
    ) {
        const showLoader = gifs.length > 0
        const marginCss = css`
            margin-left: ${gutter}px;
        `
        const gifHeightCss = css`
            height: ${gifHeight}px;
        `
        const containerCss = cx(className, carouselCss)
        const gifCss = cx(carouselItemCss, marginCss)
        return (
            <PingbackContextManager attributes={{ layout_type: 'CAROUSEL' }}>
                <div class={containerCss}>
                    {gifs.map((gif) => {
                        return (
                            <Gif
                                className={gifCss}
                                gif={gif}
                                key={gif.id}
                                tabIndex={tabIndex}
                                width={gifWidth || getGifWidth(gif, gifHeight)}
                                height={gifHeight}
                                onGifClick={onGifClick}
                                onGifHover={onGifHover}
                                onGifKeyPress={onGifKeyPress}
                                onGifSeen={onGifSeen}
                                onGifVisible={onGifVisible}
                                onGifRightClick={onGifRightClick}
                                user={user}
                                hideAttribution={hideAttribution}
                                noLink={noLink}
                                borderRadius={borderRadius}
                            />
                        )
                    })}
                    {!showLoader && gifs.length === 0 && noResultsMessage}
                    {showLoader && (
                        <Observer className={loaderContainerCss} onVisibleChange={this.onLoaderVisible}>
                            <div className={cx(loaderCss, gifHeightCss)} />
                        </Observer>
                    )}
                </div>
            </PingbackContextManager>
        )
    }
}

export default Carousel
