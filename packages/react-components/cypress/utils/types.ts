import React, { JSXElementConstructor } from 'react'
import type { SinonStub } from 'cypress/types/sinon'

export type PickEventKeys<T extends Record<string, unknown>, TPrefix extends string = 'on'> = keyof T extends infer TKey
    ? TKey extends `${TPrefix}${string}`
        ? TKey
        : never
    : never

export type PickComponentEventKeys<T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>> = PickEventKeys<
    React.ComponentProps<T>
>

export type ComponentEventStubs<T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>> = Required<
    Record<PickComponentEventKeys<T>, SinonStub>
>
