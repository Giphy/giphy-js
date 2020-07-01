import { appendGiphySDKRequestHeader } from '@giphy/js-util'
import 'intersection-observer'

export { default as Attribution } from './components/attribution'
export { default as AttributionOverlay } from './components/attribution/overlay'
export { default as GridBricks } from './components/bricks-grid'
export { default as Carousel } from './components/carousel'
export { default as Gif, GifOverlayProps, PingbackContext } from './components/gif'
export { default as Grid } from './components/grid'

const { version } = require('../package.json')

// send headers with library type and version
appendGiphySDKRequestHeader(`X-GIPHY-SDK-NAME`, 'ReactSDK')
appendGiphySDKRequestHeader(`X-GIPHY-SDK-VERSION`, version)
