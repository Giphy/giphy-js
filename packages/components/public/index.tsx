import { css } from '@giphy/js-brand'
import { PreactCarousel, vanillaJSCarousel } from './carousel-demo'
import { PreactGif, vanillaJSGif } from './gif-demo'
import { PreactGrid, vanillaJSGrid } from './grid-demo'
import { PreactVideo, vanillaJSVideo } from './video-demo'

const gridTarget = document.getElementById('grid')!
const carouselTarget = document.getElementById('carousel')!
const gifTarget = document.getElementById('gif')!
const videoTarget = document.getElementById('video')!
const banner = document.querySelector('#banner')
banner.className = css.title
document.querySelectorAll('h4').forEach((c) => (c.className = css.sectionHeader))

if (location.search.indexOf('preact') !== -1) {
    banner.textContent = 'GIPHY JS Preact Components'
    PreactCarousel.render(carouselTarget)
    PreactVideo.render(videoTarget)
    PreactGrid.render(gridTarget)
    PreactGif.render(gifTarget)
} else {
    vanillaJSCarousel(carouselTarget)
    vanillaJSGrid(gridTarget)
    vanillaJSGif(gifTarget)
    vanillaJSVideo(videoTarget)
}

declare const module: any
// Hot Module Replacement
if (module.hot) {
    module.hot.accept()
}
