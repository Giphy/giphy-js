import { h, Component, cloneElement, ComponentChildren, ComponentChild } from 'preact'
type State = {
    isVisible: boolean
}

type Props = {
    children: ComponentChildren
    onVisibleChange?: (isVisible: boolean) => void
    className?: string
}

class Observer extends Component<Props, State> {
    io: any
    container: HTMLElement | null = null
    componentDidMount() {
        this.io = new IntersectionObserver(([entry]: IntersectionObserverEntry[]) => {
            this.setState({ isVisible: entry.isIntersecting })
            const { onVisibleChange } = this.props
            if (onVisibleChange) onVisibleChange(entry.isIntersecting)
        })
        this.io.observe(this.container)
    }

    componentWillUnmount() {
        if (this.io) {
            this.io.disconnect()
        }
    }

    render({ children, className }: Props, { isVisible }: State) {
        const kids = Array.isArray(children) ? (children as ComponentChild[]) : [children]
        return (
            <div ref={div => (this.container = div)} className={className}>
                {kids.map((child: any) => (child ? cloneElement(child, { isVisible }) : null))}
            </div>
        )
    }
}

export default Observer
