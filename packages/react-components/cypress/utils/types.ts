import React, { JSXElementConstructor } from 'react'
import type { SinonStub } from 'cypress/types/sinon'

/* Pick the object keys that represent events. By default, we select all keys that start with "on".
 * Example:
 * type MyType = {
 *  onClick: () => void,
 *  age: string,
 *  onSelect: () => void
 * }
 * PickEventKeys<MuType> = 'onClick' | 'onSelect'
 */
export type PickEventKeys<T extends Record<string, unknown>, TPrefix extends string = 'on'> = keyof T extends infer TKey
    ? TKey extends `${TPrefix}${string}`
        ? TKey
        : never
    : never

export type PickComponentEventKeys<T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>> = PickEventKeys<
    React.ComponentProps<T>
>

/* Pick component props that are events based on the prefix (the default is "on") and build a type that represents Sinon stubs for that props.
 * Example:
 * type Props = {
 *  onClick: () => void,
 *  age: string,
 *  onSelect: () => void
 * }
 * const Component = (props: Props) => {...}
 *
 * ComponentEventStubs<typeof Component> == {
 *  onClick: SinonStub,
 *  onSelect: SinonStub
 * }
 */
export type ComponentEventStubs<T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>> = Required<
    Record<PickComponentEventKeys<T>, SinonStub>
>
