import { gifPaginator, GifsResult, EventProps as FetchEventProps } from '@giphy/js-fetch-api'
import { debounce } from 'throttle-debounce'
import { IGif, IUser } from '@giphy/js-types'
import { getGifWidth } from '@giphy/js-util'
import { css, cx } from 'emotion'
import React, { PureComponent, ReactType } from 'react'
import Observer from '../util/observer'
import Gif, { EventProps as GifEventProps, GifOverlayProps } from './gif'
import FetchError from './fetch-error'

const carouselCss = css`
    -webkit-overflow-scrolling: touch;
    overflow-x: auto;
    white-space: nowrap;
    position: relative;
`
const carouselItemCss = css`
    position: relative;
    display: inline-block;
    list-style: none;
    &:first-of-type {
        margin-left: 0px;
    }
    img {
        position: absolute;
        top: 0;
        left: 0;
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
    overlay?: ReactType<GifOverlayProps>
} & GifEventProps & FetchEventProps
const defaultProps = Object.freeze({
    gifHeight: 200,
    gutter: 6,
    user: {},
})

type State = {
    isFetching: boolean
    isError: boolean
    gifs: IGif[]
    isLoaderVisible: boolean
    isDoneFetching: boolean
}
const initialState = Object.freeze({
    isFetching: false,
    isError: false,
    gifs: [] as IGif[],
    isLoaderVisible: true,
    isDoneFetching: false,
})
class Carousel extends PureComponent<Props, State> {
    static className = 'giphy-carousel'
    static readonly defaultProps = defaultProps
    readonly state = initialState
    el?: HTMLElement
    paginator: () => Promise<IGif[]>
    constructor(props: Props) {
        super(props)
        const { fetchGifs, onFetch, onPage } = props
        this.paginator = gifPaginator({ fetchGifs, onFetch, onPage })
    }
    componentDidMount() {
        this.onFetch()
    }
    onLoaderVisible = (isVisible: boolean) => {
        this.setState({ isLoaderVisible: isVisible }, this.onFetch)
    }
    onFetch = debounce(100, async () => {
        const { isFetching, isLoaderVisible, gifs: existingGifs } = this.state
        if (!isFetching && isLoaderVisible) {
            this.setState({ isFetching: true, isError: false })
            let gifs
            try {
                gifs = await this.paginator()
            } catch (error) {
                this.setState({ isFetching: false, isError: true })
                const { onFetchError } = this.props
                if (onFetchError) onFetchError(error)
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
    render() {
        const {
            fetchGifs,
            onGifVisible,
            onGifRightClick,
            gifHeight,
            gutter,
            className = Carousel.className,
            onGifHover,
            onGifUnhover,
            onGifSeen,
            onGifClick,
            user,
            overlay,
        } = this.props
        const { gifs, isError, isDoneFetching } = this.state
        const showLoader = fetchGifs && gifs.length > 0 && !isDoneFetching
        const marginCss = css`
            margin-left: ${gutter}px;
        `
        const containerHeightCss = css`
            height: ${gifHeight}px;
        `
        const containerCss = cx(className, containerHeightCss, carouselCss)
        const gifCss = cx(carouselItemCss, marginCss)
        return (
            <div className={containerCss}>
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
                            onGifUnhover={onGifUnhover}
                            onGifSeen={onGifSeen}
                            onGifVisible={onGifVisible}
                            onGifRightClick={onGifRightClick}
                            user={user}
                            overlay={overlay}
                        />
                    )
                })}
                {isError ? (
                    <FetchError onClick={this.onFetch} />
                ) : (
                    showLoader && (
                        <Observer className={loaderContainerCss} onVisibleChange={this.onLoaderVisible}>
                            <div className={loaderCss} />
                        </Observer>
                    )
                )}
            </div>
        )
    }
}

export default Carousel
