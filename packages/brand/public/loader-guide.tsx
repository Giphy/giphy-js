import { h } from 'preact'
import loader from '../src/loader'

const LoaderGuide = () => (
    <div>
        <h2>Loader</h2>
        <div className={loader} style={{ margin: 0 }}>
            <div />
            <div />
            <div />
            <div />
            <div />
        </div>
    </div>
)

export default LoaderGuide
