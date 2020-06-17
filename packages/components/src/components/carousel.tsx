import { gifPaginator, GifsResult } from '@giphy/js-fetch-api'
import { IGif, IUser } from '@giphy/js-types'
import { getGifWidth } from '@giphy/js-util'
import { css, cx } from 'emotion'
import { Component, h, JSX } from 'preact'
import { debounce } from 'throttle-debounce'
import Observer from '../util/observer'
import Gif, { EventProps } from './gif'

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
    gutter: number
    fetchGifs: (offset: number) => Promise<GifsResult>
    onGifsFetched?: (gifs: IGif[]) => void
    noResultsMessage?: string | JSX.Element
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
            fetchGifs,
            onGifVisible,
            onGifRightClick,
            gifHeight,
            gutter,
            className = Carousel.className,
            onGifClick,
            onGifHover,
            onGifSeen,
            user,
            noResultsMessage,
        }: Props,
        { gifs }: State
    ) {
        const showLoader = fetchGifs && gifs.length > 0
        const marginCss = css`
            margin-left: ${gutter}px;
        `
        const gifHeightCss = css`
            height: ${gifHeight}px;
        `
        const containerCss = cx(className, carouselCss)
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
                            onGifClick={onGifClick}
                            onGifHover={onGifHover}
                            onGifSeen={onGifSeen}
                            onGifVisible={onGifVisible}
                            onGifRightClick={onGifRightClick}
                            user={user}
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
        )
    }
}

export default Carousel
