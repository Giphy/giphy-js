import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useAsyncFn, useDebounce, useLatest, useRaf, useThrottle, useTimeoutFn } from '../../src/hooks'

describe('hooks', () => {
    describe('useDebounce', () => {
        const Harness = ({ ms }: { ms: number }) => {
            const [val, setVal] = useState('')
            const [debounced, setDebounced] = useState('')
            useDebounce(() => setDebounced(val), ms, [val])
            return (
                <div>
                    <input data-test="input" value={val} onChange={(e) => setVal(e.target.value)} />
                    <div data-test="debounced">{debounced}</div>
                </div>
            )
        }

        it('only invokes the callback after ms with the latest value', () => {
            cy.clock()
            cy.mount(<Harness ms={500} />)
            cy.get('[data-test="input"]').type('abc')
            cy.get('[data-test="debounced"]').should('have.text', '')
            cy.tick(499)
            cy.get('[data-test="debounced"]').should('have.text', '')
            cy.tick(1)
            cy.get('[data-test="debounced"]').should('have.text', 'abc')
        })
    })

    describe('useThrottle', () => {
        const Harness = ({ ms }: { ms: number }) => {
            const [count, setCount] = useState(0)
            const throttled = useThrottle(count, ms)
            return (
                <div>
                    <button data-test="inc" onClick={() => setCount((c) => c + 1)} />
                    <div data-test="throttled">{throttled}</div>
                </div>
            )
        }

        it('applies the first value immediately and trailing values once the window elapses', () => {
            cy.clock()
            cy.mount(<Harness ms={1000} />)
            cy.get('[data-test="throttled"]').should('have.text', '0')
            cy.get('[data-test="inc"]').click().click().click()
            // still within the throttle window
            cy.get('[data-test="throttled"]').should('have.text', '0')
            cy.tick(1000)
            cy.get('[data-test="throttled"]').should('have.text', '3')
        })
    })

    describe('useTimeoutFn', () => {
        const Harness = ({ ms }: { ms: number }) => {
            const [fired, setFired] = useState(0)
            const [, cancel, reset] = useTimeoutFn(() => setFired((f) => f + 1), ms)
            return (
                <div>
                    <button data-test="cancel" onClick={cancel} />
                    <button data-test="reset" onClick={reset} />
                    <div data-test="fired">{fired}</div>
                </div>
            )
        }

        it('fires once after ms', () => {
            cy.clock()
            cy.mount(<Harness ms={300} />)
            cy.tick(299)
            cy.get('[data-test="fired"]').should('have.text', '0')
            cy.tick(1)
            cy.get('[data-test="fired"]').should('have.text', '1')
            cy.tick(1000)
            cy.get('[data-test="fired"]').should('have.text', '1')
        })

        it('does not fire after cancel', () => {
            cy.clock()
            cy.mount(<Harness ms={300} />)
            cy.get('[data-test="cancel"]').click()
            cy.tick(1000)
            cy.get('[data-test="fired"]').should('have.text', '0')
        })

        it('fires again after reset', () => {
            cy.clock()
            cy.mount(<Harness ms={300} />)
            cy.tick(300)
            cy.get('[data-test="fired"]').should('have.text', '1')
            cy.get('[data-test="reset"]').click()
            cy.tick(300)
            cy.get('[data-test="fired"]').should('have.text', '2')
        })
    })

    describe('useAsyncFn', () => {
        const Harness = () => {
            const deferred = useRef<{ resolve:(v: string) => void; reject: (e: Error) => void }>()
            const [state, run] = useAsyncFn(
                () =>
                    new Promise<string>((resolve, reject) => {
                        deferred.current = { resolve, reject }
                    }),
                [],
                { loading: true }
            )
            useEffect(() => {
                run()
            }, [run])
            return (
                <div>
                    <button data-test="resolve" onClick={() => deferred.current?.resolve('done')} />
                    <button data-test="reject" onClick={() => deferred.current?.reject(new Error('nope'))} />
                    <div data-test="loading">{String(state.loading)}</div>
                    <div data-test="value">{state.value ?? ''}</div>
                    <div data-test="error">{state.error?.message ?? ''}</div>
                </div>
            )
        }

        it('honors initialState and transitions to value on resolve', () => {
            cy.mount(<Harness />)
            cy.get('[data-test="loading"]').should('have.text', 'true')
            cy.get('[data-test="resolve"]').click()
            cy.get('[data-test="loading"]').should('have.text', 'false')
            cy.get('[data-test="value"]').should('have.text', 'done')
            cy.get('[data-test="error"]').should('have.text', '')
        })

        it('transitions to error on reject', () => {
            cy.mount(<Harness />)
            cy.get('[data-test="reject"]').click()
            cy.get('[data-test="loading"]').should('have.text', 'false')
            cy.get('[data-test="error"]').should('have.text', 'nope')
            cy.get('[data-test="value"]').should('have.text', '')
        })
    })

    describe('useLatest', () => {
        const Harness = () => {
            const [count, setCount] = useState(0)
            const latest = useLatest(count)
            const [read, setRead] = useState(-1)
            // stale closure on purpose: the ref must still expose the latest value
            const readLatest = useCallback(() => setRead(latest.current), [latest])
            return (
                <div>
                    <button data-test="inc" onClick={() => setCount((c) => c + 1)} />
                    <button data-test="read" onClick={readLatest} />
                    <div data-test="read-value">{read}</div>
                </div>
            )
        }

        it('exposes the latest value through a stable ref', () => {
            cy.mount(<Harness />)
            cy.get('[data-test="inc"]').click().click()
            cy.get('[data-test="read"]').click()
            cy.get('[data-test="read-value"]').should('have.text', '2')
        })
    })

    describe('useRaf', () => {
        const Harness = () => {
            const elapsed = useRaf(400, 0)
            return <div data-test="elapsed">{elapsed}</div>
        }

        it('re-renders with increasing elapsed time and stops at 1', () => {
            cy.mount(<Harness />)
            cy.get('[data-test="elapsed"]').should(($el) => {
                expect(parseFloat($el.text())).to.be.greaterThan(0)
            })
            cy.get('[data-test="elapsed"]').should('have.text', '1')
        })
    })
})
