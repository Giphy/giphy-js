import { fontFamily, giphyBlue, giphyLightGrey } from '@giphy/js-brand'
import { css } from '@emotion/css'
import { h } from 'preact'
const fetchError = css`
    color: ${giphyLightGrey};
    display: flex;
    justify-content: center;
    margin: 30px 0;
    font-family: ${fontFamily.body};
    font-size: 16px;
    font-weight: 600;
    a {
        color: ${giphyBlue};
        cursor: pointer;
        &:hover {
            color: white;
        }
    }
`
type Props = { onClick: (e: Event) => void }
const FetchError = ({ onClick }: Props) => (
    <div className={fetchError}>
        Error loading GIFs.&nbsp;<a onClick={onClick}>Try again?</a>
    </div>
)
export default FetchError
