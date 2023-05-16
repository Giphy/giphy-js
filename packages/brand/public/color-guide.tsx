import { h } from 'preact'
import * as colors from '../src/colors'
import { css, cx } from 'emotion'
import { css as typographtCss } from '../src/typography'

const colorsCss = cx(
    typographtCss.subheaderSmall,
    css`
        display: flex;
        flex-wrap: wrap;
        color: ${colors.giphyLightestGrey};
    `
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
    <div className={item}>
        <div className={colorCss} style={{ backgroundColor: color }} />
        <div>{name}</div>
        <div>{color}</div>
    </div>
)

const Colors = Object.keys(colors).map((color) =>
    color !== '__esModule' ? <Color key={color} color={colors[color]} name={color} /> : null
)

const ColorsGuide = () => (
    <div>
        <h2>Colors</h2>
        <div className={colorsCss}>{Colors}</div>
    </div>
)

export default ColorsGuide
