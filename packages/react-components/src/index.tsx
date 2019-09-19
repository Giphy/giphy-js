import 'intersection-observer'
import { appendGiphySDKRequestParam } from '@giphy/js-util'

export { default as Carousel } from './components/carousel'
export { default as Gif, GifOverlayProps } from './components/gif'
export { default as Grid } from './components/grid'

const { version } = require('../package.json')
// send headers with library type and version
appendGiphySDKRequestParam(`x-giphy-sdk-name`, 'ReactSDK')
appendGiphySDKRequestParam(`x-giphy-sdk-version`, version)
