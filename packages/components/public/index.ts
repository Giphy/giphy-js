import { throttle } from 'throttle-debounce'
import { renderGrid } from '../src'

// to require json, we need to define require
declare function require(name: string): any

// test gifs
const gifs = require('./gifs.json')
const gifs2 = require('./gifs.2.json')

const columns = 3
const gutter = 6
let renderGifs = gifs

const getWidth = () => innerWidth - 20

// fake fetch gifs
let fetched = false
const fetchGifs = () => {
    if (!fetched) {
        fetched = true
        setTimeout(() => {
            renderGifs = [...gifs, ...gifs2]
            render()
        }, 2000)
    }
}

const mountNode = document.getElementById('root')!

const render = () => {
    const width = getWidth()
    renderGrid({ width, gifs: renderGifs, columns, gutter, fetchGifs }, mountNode)
}

const setWidth = throttle(500, render)
window.addEventListener('resize', setWidth, false)
setTimeout(() => {
    renderGifs = gifs
    render()
}, 1000)

declare const module: any
// Hot Module Replacement
if (module.hot) {
    module.hot.accept()
}

render()
