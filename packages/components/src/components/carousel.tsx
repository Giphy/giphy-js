import { gifPaginator, GifsResult } from '@giphy/js-fetch-api'
import { debounce } from 'throttle-debounce'
import { IGif, IUser } from '@giphy/js-types'
import { getGifWidth } from '@giphy/js-util'
import { css, cx } from 'emotion'
import { Component, h } from 'preact'
import Observer from '../util/observer'
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

type Props = {
    className?: string
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
    isDoneFetching: boolean
}
class Carousel extends Component<Props, State> {
    static className = 'giphy-carousel'
    state = {
        isFetching: false,
        numberOfGifs: 0,
        gifs: [],
        isLoaderVisible: true,
        isDoneFetching: false,
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
    render(
        {
            fetchGifs,
            onGifVisible,
            onGifRightClick,
            gifHeight,
            gutter = 6,
            className = Carousel.className,
            onGifClick,
            onGifHover,
            onGifSeen,
            user,
        }: Props,
        { gifs }: State,
    ) {
        const showLoader = fetchGifs && gifs.length > 0
        const marginCss = css`
            margin-left: ${gutter}px;
        `
        const containerHeightCss = css`
            height: ${gifHeight}px;
        `
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
                            onGifClick={onGifClick}
                            onGifHover={onGifHover}
                            onGifSeen={onGifSeen}
                            onGifVisible={onGifVisible}
                            onGifRightClick={onGifRightClick}
                            user={user}
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
