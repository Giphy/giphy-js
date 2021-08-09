import { appendGiphySDKRequestHeader } from '@giphy/js-util'
import 'intersection-observer'

export { default as Attribution } from './components/attribution'
export { default as AttributionOverlay } from './components/attribution/overlay'
export { default as Carousel } from './components/carousel'
export { default as Gif } from './components/gif'
export { default as Grid } from './components/grid'
export { PingbackContext } from './components/pingback-context-manager'
export { default as SearchBar } from './components/search-bar'
export { default as SearchContextManager, SearchContext } from './components/search-bar/context'
export { default as SuggestionBar } from './components/search-bar/suggestion-bar'
export type { GifOverlayProps } from './components/types'
export { default as Video } from './components/video'
export * from './components/video/controls/play-pause'
export * from './components/video/controls/volume'
export { default as VideoOverlay } from './components/video/video-overlay'

const { version } = require('../package.json')

// send headers with library type and version
appendGiphySDKRequestHeader(`X-GIPHY-SDK-NAME`, 'ReactSDK')
appendGiphySDKRequestHeader(`X-GIPHY-SDK-VERSION`, version)
