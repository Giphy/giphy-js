import 'intersection-observer'
import React, { ReactNode, useEffect, useRef, useState } from 'react'

function usePrevious<T>(value: T) {
    const ref = useRef<T>(value)
    useEffect(() => {
        ref.current = value
    })
    return ref.current
}

type Props = {
    children: ReactNode
    onVisibleChange?: (isVisible: boolean) => void
    onVisible?: () => void
    onHidden?: () => void
    className?: string
    style?: object
    fireOnce?: boolean // fire once when visible
}

const noop = () => {}
const Observer = ({
    className,
    children,
    onVisibleChange = noop,
    onVisible = noop,
    onHidden = noop,
    style,
    fireOnce = false,
}: Props) => {
    const observerRef = useRef<HTMLDivElement>(null)
    const [isIntersecting, setIntersecting] = useState<boolean>(false)
    const lastIntersecting = usePrevious(isIntersecting)
    useEffect(() => {
        if (lastIntersecting !== isIntersecting) {
            onVisibleChange(isIntersecting)
            isIntersecting ? onVisible() : onHidden()
        }
    }, [isIntersecting])

    useEffect(() => {
        if (!observerRef.current) return
        const io = new IntersectionObserver(([entry]: IntersectionObserverEntry[]) => {
            if (fireOnce) {
                if (entry.isIntersecting) {
                    setIntersecting(true)
                    io.disconnect()
                }
            } else {
                setIntersecting(entry.isIntersecting)
            }
        })
        io.observe(observerRef.current)

        return () => {
            io.disconnect()
        }
    }, [observerRef])

    return (
        <div ref={observerRef} className={className} style={style}>
            {children}
        </div>
    )
}

export default Observer
