import { mergeAttributes, PingbackAttributes } from '@giphy/js-analytics'
import React, { createContext, FC, useContext } from 'react'

type PingbackContextProps = { attributes: PingbackAttributes }
export const PingbackContext = createContext({} as PingbackContextProps)

// aggrigate attributes
const PingbackContextManager: FC<PingbackContextProps> = ({ attributes, children }) => {
    const { attributes: parentAttributes = {} } = useContext(PingbackContext)
    return (
        <PingbackContext.Provider value={{ attributes: mergeAttributes(parentAttributes, attributes, 'layout_type') }}>
            {children}
        </PingbackContext.Provider>
    )
}
export default PingbackContextManager
