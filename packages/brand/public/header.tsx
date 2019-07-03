import { h } from 'preact'
import { css } from 'emotion'
const header = css`
    align-items: center;
    background: no-repeat url('https://media.giphy.com/channel_assets/originals/rf5TWGqR6jX4.gif') center center;
    background-size: cover;
    display: flex;
    height: 160px;
    justify-content: center;
    margin-bottom: 20px;
    position: relative;
    width: 100%;

    h1 {
        font-size: 60px;
        position: relative;
    }

    &:before {
        background: rgba(0, 0, 0, 0.1);
        content: '';
        height: 100%;
        left: 0;
        position: absolute;
        top: 0;
        width: 100%;
    }
`

const Header = ({ children }: { children?: ChildNode }) => <div className={header}>{children}</div>

export default Header
