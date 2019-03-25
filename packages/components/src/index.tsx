import { h, render } from 'preact'
import Grid, { Props as GridProps, className } from './components/grid'
export { default as Grid, Props as GridProps } from './components/grid'
export { default as Gif } from './components/gif'

export const renderGrid = ({ width, gifs, columns, gutter, fetchGifs, user = {} }: GridProps, target: HTMLElement) => {
    // preact will append if there's no existig node
    const existingNode = target.querySelector(`.${className}`)!
    render(
        <Grid
            width={width}
            user={user}
            gifs={gifs}
            columns={columns}
            gutter={gutter}
            fetchGifs={fetchGifs}
            pingbackEventType="GIF_SEARCH"
        />,
        target,
        existingNode,
    )
}
