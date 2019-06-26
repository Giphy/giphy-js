import React from 'react'
import ReactDOM from 'react-dom'
import GridShowcase from './grid'
import { css } from '@giphy/js-brand'
import CarouselShowcase from './carousel'
import GifShowcase from './gif'

const target = document.getElementById('react-target')!
const banner = document.querySelector('#banner')
banner.className = css.title
banner.textContent = 'GIPHY JS React Components'

const Components = () => (
    <div>
        <section>
            <h4 className={css.sectionHeader}>Gif</h4>
            <GifShowcase />
        </section>
        <section>
            <h4>Carousel</h4>
            <CarouselShowcase />
        </section>
        <section>
            <h4>Grid</h4>
            <GridShowcase />
        </section>
    </div>
)
ReactDOM.render(<Components />, target)
declare const module: any
// Hot Module Replacement
if (module.hot) {
    module.hot.accept()
}
