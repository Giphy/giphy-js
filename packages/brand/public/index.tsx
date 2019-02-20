import { h, render } from 'preact'
import Colors from './color-display'

declare const module: any

const mountNode = document.getElementById('root')!

render(<Colors />, mountNode, mountNode.lastChild as Element)

// Hot Module Replacement
if (module.hot) {
    module.hot.accept()
}
