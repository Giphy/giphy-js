import React, { PureComponent, ReactNode } from 'react'

type Props = {
    children: ReactNode
    onVisibleChange: (isVisible: boolean) => void
    className?: string
}

class Observer extends PureComponent<Props> {
    io: any
    container?: HTMLDivElement | null
    componentDidMount() {
        this.io = new IntersectionObserver(([entry]: IntersectionObserverEntry[]) => {
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

    render() {
        const { children, className } = this.props
        return (
            <div ref={div => (this.container = div)} className={className}>
                {children}
            </div>
        )
    }
}

export default Observer
