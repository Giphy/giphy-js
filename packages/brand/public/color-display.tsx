import { h } from 'preact'
import colors from '../src/colors.css'

// @ts-ignore
import css from './color-display.css'
const Color = ({ color, name }) => (
    <div class={css.item}>
        <div class={css.color} style={{ backgroundColor: color }} />
        <div>{name}</div>
        <div>{color}</div>
    </div>
)

const Colors = Object.keys(colors).map(color => <Color color={colors[color]} name={color} />)

export default () => <div class={css.colors}>{Colors}</div>
