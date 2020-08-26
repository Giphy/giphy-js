import styled from '@emotion/styled'
import { gifPaginator, GifsResult } from '@giphy/js-fetch-api'
import { IGif, IUser } from '@giphy/js-types'
import { getGifWidth } from '@giphy/js-util'
import React, { PureComponent, ReactType } from 'react'
import { debounce } from 'throttle-debounce'
import ObserverShared from '../util/observer'
import Gif_, { EventProps, GifOverlayProps } from './gif'

const Container = styled.div`
    -webkit-overflow-scrolling: touch;
    overflow-x: auto;
    overflow-y: hidden;
    white-space: nowrap;
    position: relative;
`

const Gif = styled(Gif_)<{ ml: number }>`
    position: relative;
    display: inline-block;
    list-style: none;
    margin-left: ${(props) => props.ml}px;
    /* make sure gifs are fully visible with a scrollbar */
    margin-bottom: 1px;

    &:first-of-type {
        margin-left: 0;
    }
    .${Gif_.imgClassName} {
        position: absolute;
        top: 0;
        left: 0;
    }
`

const Observer = styled(ObserverShared)`
    display: inline-block;
`

const Loader = styled.div<{ isFirstLoad: boolean; height: number }>`
    width: 30px;
    display: inline-block;
    opacity: ${(props) => (props.isFirstLoad ? 0 : 1)};
    height: ${(props) => props.height}px;
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
    backgroundColor?: string
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
            backgroundColor,
        } = this.props
        const { gifs, isDoneFetching } = this.state
        const showLoader = fetchGifs && !isDoneFetching
        const isFirstLoad = gifs.length === 0
        return (
            <Container className={className}>
                {gifs.map((gif) => {
                    const gifWidth = getGifWidth(gif, gifHeight)
                    return (
                        <Gif
                            gif={gif}
                            key={gif.id}
                            width={gifWidth}
                            onGifClick={onGifClick}
                            onGifSeen={onGifSeen}
                            onGifVisible={onGifVisible}
                            onGifRightClick={onGifRightClick}
                            user={user}
                            ml={gutter}
                            overlay={overlay}
                            hideAttribution={hideAttribution}
                            noLink={noLink}
                            backgroundColor={backgroundColor}
                        />
                    )
                })}
                {!showLoader && gifs.length === 0 && noResultsMessage}
                {showLoader && (
                    <Observer onVisibleChange={this.onLoaderVisible}>
                        <Loader isFirstLoad={isFirstLoad} height={gifHeight} />
                    </Observer>
                )}
            </Container>
        )
    }
}

export default Carousel
