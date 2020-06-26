import { h, render } from 'preact'
import ColorsGuide from './color-guide'
import Header from './header'
import LoaderGuide from './loader-guide'

// reference h so vscode doesn't remove it with organize imports
// eslint-disable-next-line @typescript-eslint/no-unused-expressions
h

declare const module: any

const mountNode = document.getElementById('root')!

render(
    <div>
        <Header>
            <h1>GIPHY Brand</h1>
        </Header>
        <ColorsGuide />
        <LoaderGuide />
    </div>,
    mountNode,
    mountNode.lastChild as Element
)

// Hot Module Replacement
if (module.hot) {
    module.hot.accept()
}
