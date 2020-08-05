import { gifPaginator, GifsResult } from '@giphy/js-fetch-api'
import { IGif, IUser } from '@giphy/js-types'
import { getGifWidth } from '@giphy/js-util'
import { css, cx } from 'emotion'
import React, { PureComponent, ReactType } from 'react'
import { debounce } from 'throttle-debounce'
import Observer from '../util/observer'
import Gif, { EventProps, GifOverlayProps } from './gif'

const carouselCss = css`
    -webkit-overflow-scrolling: touch;
    overflow-x: auto;
    overflow-y: hidden;
    white-space: nowrap;
    position: relative;
`

const loaderHiddenCss = css`
    opacity: 0;
`

const carouselItemCss = css`
    position: relative;
    display: inline-block;
    list-style: none;
    /* make sure gifs are fully visible with a scrollbar */
    margin-bottom: 1px;
    &:first-of-type {
        margin-left: 0;
    }
    .${Gif.imgClassName} {
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
    display: inline-block;
`

type Props = {
    className?: string
    user: Partial<IUser>
    gifHeight: number
    gutter: number
    fetchGifs: (offset: number) => Promise<GifsResult>
    onGifsFetched?: (gifs: IGif[]) => void
    overlay?: ReactType<GifOverlayProps>
    hideAttribution?: boolean
    noLink?: boolean
    noResultsMessage?: string | JSX.Element
    initialGifs?: IGif[]
} & EventProps

const defaultProps = Object.freeze({ gutter: 6, user: {}, initialGifs: [] })
type State = {
    isFetching: boolean
    gifs: IGif[]
    isLoaderVisible: boolean
    isDoneFetching: boolean
}
const initialState = Object.freeze({
    isFetching: false,
    gifs: [] as IGif[],
    isLoaderVisible: false,
    isDoneFetching: false,
})
class Carousel extends PureComponent<Props, State> {
    static className = 'giphy-carousel'
    static readonly defaultProps = defaultProps
    readonly state = { ...initialState, gifs: this.props.initialGifs || [] }
    el?: HTMLElement
    unmounted: boolean = false
    paginator = gifPaginator(this.props.fetchGifs, this.state.gifs)
    componentDidMount() {
        this.onFetch()
    }

    componentWillUnmount() {
        this.unmounted = true
    }

    onLoaderVisible = (isVisible: boolean) => {
        if (this.unmounted) return
        this.setState({ isLoaderVisible: isVisible }, this.onFetch)
    }

    onFetch = debounce(100, async () => {
        if (this.unmounted) return
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

    render() {
        const {
            fetchGifs,
            onGifVisible,
            onGifRightClick,
            gifHeight,
            gutter,
            className = Carousel.className,
            onGifSeen,
            onGifClick,
            user,
            overlay,
            hideAttribution,
            noLink,
            noResultsMessage,
        } = this.props
        const { gifs, isDoneFetching } = this.state
        const marginCss = css`
            margin-left: ${gutter}px;
        `
        const gifHeightCss = css`
            height: ${gifHeight}px;
        `
        const containerCss = cx(className, carouselCss)
        const gifCss = cx(carouselItemCss, marginCss)
        const showLoader = fetchGifs && !isDoneFetching
        const isFirstLoad = gifs.length === 0
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
                            onGifSeen={onGifSeen}
                            onGifVisible={onGifVisible}
                            onGifRightClick={onGifRightClick}
                            user={user}
                            overlay={overlay}
                            hideAttribution={hideAttribution}
                            noLink={noLink}
                        />
                    )
                })}
                {!showLoader && gifs.length === 0 && noResultsMessage}
                {showLoader && (
                    <Observer className={loaderContainerCss} onVisibleChange={this.onLoaderVisible}>
                        <div className={cx(loaderCss, gifHeightCss, isFirstLoad ? loaderHiddenCss : '')} />
                    </Observer>
                )}
            </div>
        )
    }
}

export default Carousel
