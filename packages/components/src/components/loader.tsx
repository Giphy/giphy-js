import { cx } from '@emotion/css'
import { loader } from '@giphy/js-brand'
import { h } from 'preact'

// trying to share css from brand, but this has an element structure
// so it's ugly. will probably move the css in here
export default ({ className = '' }: { className?: string }) => (
    <div className={cx(loader, className)}>
        <div />
        <div />
        <div />
        <div />
        <div />
    </div>
)
