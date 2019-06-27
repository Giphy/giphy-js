import React from 'react'
import ReactDOM from 'react-dom'
import GridDemo from './grid-demo'
import { css } from '@giphy/js-brand'
import CarouselDemo from './carousel-demo'
import GifDemo from './gif-demo'

const target = document.getElementById('react-target')!
const banner = document.querySelector('#banner')
banner.className = css.title
banner.textContent = 'GIPHY JS React Components'

const Components = () => (
    <div>
        <section>
            <h4 className={css.sectionHeader}>Gif</h4>
            <GifDemo />
        </section>
        <section>
            <h4>Carousel</h4>
            <CarouselDemo />
        </section>
        <section>
            <h4>Grid</h4>
            <GridDemo />
        </section>
    </div>
)
ReactDOM.render(<Components />, target)
declare const module: any
// Hot Module Replacement
if (module.hot) {
    module.hot.accept()
}
