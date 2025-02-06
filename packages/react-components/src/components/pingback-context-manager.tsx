import { mergeAttributes, PingbackAttributes } from '@giphy/js-analytics'
import React, { createContext, ReactNode, useContext } from 'react'

type PingbackContextProps = {
    attributes: PingbackAttributes
    children?: ReactNode
}

export const PingbackContext = createContext({} as PingbackContextProps)

// aggrigate attributes
const PingbackContextManager = ({ attributes, children }: { attributes: PingbackAttributes; children: ReactNode }) => {
    const { attributes: parentAttributes = {} } = useContext(PingbackContext)
    return (
        <PingbackContext.Provider
            value={{
                attributes: mergeAttributes(parentAttributes, attributes, 'layout_type'),
            }}
        >
            {children}
        </PingbackContext.Provider>
    )
}
export default PingbackContextManager
