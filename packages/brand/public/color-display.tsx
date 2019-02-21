import { h } from 'preact'
import * as colors from '../src/colors'
import { css, cx } from 'emotion'
import { SubheaderSmall } from '../src/typography'

const colorsCss = cx(
    SubheaderSmall,
    css`
        display: flex;
        flex-wrap: wrap;
        color: ${colors.giphyLightestGrey};
    `,
)
const item = css`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px;
`
const colorCss = css`
    width: 80px;
    height: 50px;
    border: 1px solid white;
    margin: 3px;
`

const Color = ({ color, name }) => (
    <div class={item}>
        <div class={colorCss} style={{ backgroundColor: color }} />
        <div>{name}</div>
        <div>{color}</div>
    </div>
)

const Colors = Object.keys(colors).map(color =>
    color !== '__esModule' ? <Color color={colors[color]} name={color} /> : null,
)

export default () => <div class={colorsCss}>{Colors}</div>
