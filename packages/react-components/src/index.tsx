import { appendGiphySDKRequestHeader } from '@giphy/js-util'
import './pollyfill'
export { default as Attribution } from './components/attribution'
export { default as AttributionOverlay } from './components/attribution/overlay'
export { default as VerifiedBadge } from './components/attribution/verified-badge'
export { default as Carousel } from './components/carousel'
export { EmojiVariationsList } from './components/emoji-variations-list'
export type { EmojiVariationsListProps } from './components/emoji-variations-list'
export { default as Gif } from './components/gif'
export { default as Grid } from './components/grid'
export { default as Loader } from './components/loader'
export { PingbackContext } from './components/pingback-context-manager'
export { default as SearchBar } from './components/search-bar'
export { SearchContext, default as SearchContextManager } from './components/search-bar/context'
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
