import { h, Component } from 'preact'
import { loader } from '@giphy/js-brand'
type Props = { isVisible?: boolean; fetchGifs: () => void }

type State = {}

class Loader extends Component<Props, State> {
    componentDidUpdate(prevProps: Props) {
        const { isVisible, fetchGifs }: Props = this.props
        if (prevProps.isVisible !== isVisible && isVisible) {
            fetchGifs()
        }
    }
    render() {
        return <div class={loader} />
    }
}

export default Loader
