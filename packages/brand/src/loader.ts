import { css, keyframes } from 'emotion'
import { giphyBlue, giphyGreen, giphyPurple, giphyRed, giphyYellow } from './colors'

const bouncer = keyframes`
     to {
    transform: scale(1.75) translateY(-20px);
  }
`
const loaderHeight = 37
const loader = css`
    display: flex;
    align-items: center;
    height: ${loaderHeight}px;
    padding-top: 15px;
    margin: 0 auto;
    text-align: center;
    justify-content: center;
    animation: pulse 0.8s ease-in-out 0s infinite alternate backwards;
    div {
        display: inline-block;
        height: 10px;
        width: 10px;
        margin: ${loaderHeight}px 10px 10px 10px;
        position: relative;
        box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.3);
        animation: ${bouncer} cubic-bezier(0.455, 0.03, 0.515, 0.955) 0.75s infinite alternate;
        &:nth-child(5n + 1) {
            background: ${giphyGreen};
            animation-delay: 0;
        }
        &:nth-child(5n + 2) {
            background: ${giphyBlue};
            animation-delay: calc(0s + (0.1s * 1));
        }
        &:nth-child(5n + 3) {
            background: ${giphyPurple};
            animation-delay: calc(0s + (0.1s * 2));
        }
        &:nth-child(5n + 4) {
            background: ${giphyRed};
            animation-delay: calc(0s + (0.1s * 3));
        }
        &:nth-child(5n + 5) {
            background: ${giphyYellow};
            animation-delay: calc(0s + (0.1s * 4));
        }
    }
`
export default loader
