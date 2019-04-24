import { PreactGrid, vanillaJSGrid } from './grid'
import { css } from '@giphy/js-brand'
import { PreactCarousel, vanillaJSCarousel } from './carousel'
import { vanillaJSGif, PreactGif } from './gif'

const gridTarget = document.getElementById('grid')!
const carouselTarget = document.getElementById('carousel')!
const gifTarget = document.getElementById('gif')!
const banner = document.querySelector('#banner')
banner.className = css.title
document.querySelectorAll('h4').forEach(c => (c.className = css.sectionHeader))

if (location.search.indexOf('preact') !== -1) {
    banner.textContent = 'GIPHY JS Preact Components'
    PreactCarousel.render(carouselTarget)
    PreactGrid.render(gridTarget)
    PreactGif.render(gifTarget)
} else {
    vanillaJSCarousel(carouselTarget)
    this.gridRemove = vanillaJSGrid(gridTarget)
    vanillaJSGif(gifTarget)
}

declare const module: any
// Hot Module Replacement
if (module.hot) {
    module.hot.accept()
}
