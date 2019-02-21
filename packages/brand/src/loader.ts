import { css, keyframes } from 'emotion'
import { giphyBlack, giphyGreen, giphyWhite } from './colors'

const loaderBar = keyframes`
    0% {
        transform: translateX(-20%);
    }
    100% {
        transform: translateX(120%);
    }
`
const loader = css`
    box-sizing: content-box;
    width: 100%;
    padding: 30px 0 0;
    height: 10px;
    overflow: hidden;
    position: relative;
    list-style: none;

    &:before {
        animation: ${loaderBar} 2s ease-in-out 0s infinite;
        box-shadow: 10px 10px ${giphyBlack}, 20px 10px #007f4c, 30px 10px #00bf73, 40px 10px ${giphyGreen},
            50px 10px ${giphyGreen}, 60px 10px ${giphyGreen}, 70px 10px ${giphyGreen}, 80px 10px ${giphyGreen},
            90px 10px ${giphyGreen}, 100px 10px ${giphyGreen}, 110px 10px ${giphyWhite};
        bottom: 10px;
        content: '';
        display: block;
        height: 10px;
        margin-right: 55px;
        position: absolute;
        right: 100%;
        width: 100%;
    }
`

export default loader
