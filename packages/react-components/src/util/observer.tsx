import 'intersection-observer'
import React, { FC, ReactNode, useEffect, useRef } from 'react'

type Props = {
    // can't get FC<Props> to pass eslintreact/prop-types warning :/
    children: ReactNode
    onVisibleChange: (isVisible: boolean) => void
    className?: string
    config?: IntersectionObserverInit
}

const Observer: FC<Props> = ({ children, className, onVisibleChange, config }: Props) => {
    const container = useRef<HTMLDivElement | null>(null)
    useEffect(() => {
        let io: IntersectionObserver | undefined
        if (container.current) {
            io = new IntersectionObserver(([entry]: IntersectionObserverEntry[]) => {
                if (onVisibleChange) onVisibleChange(entry.isIntersecting)
            }, config)
            io.observe(container.current)
        }
        return () => io?.disconnect()
    }, [onVisibleChange, container, config])
    return (
        <div ref={container} className={className}>
            {children}
        </div>
    )
}

export default Observer
