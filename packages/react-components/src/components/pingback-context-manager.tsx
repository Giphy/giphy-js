import { mergeAttributes, PingbackAttributes } from '@giphy/js-analytics'
import { PingbackEventType } from '@giphy/js-types'
import React, { createContext, FC, useContext } from 'react'

type PingbackContextProps = { attributes: PingbackAttributes; eventType?: PingbackEventType }
export const PingbackContext = createContext({} as PingbackContextProps)

// aggrigate attributes
const PingbackContextManager: FC<PingbackContextProps> = ({ eventType, attributes, children }) => {
    const { attributes: parentAttributes = {}, eventType: parentEventType = undefined } = useContext(PingbackContext)
    return (
        <PingbackContext.Provider
            value={{
                eventType: parentEventType || eventType,
                attributes: mergeAttributes(parentAttributes, attributes, 'layout_type'),
            }}
        >
            {children}
        </PingbackContext.Provider>
    )
}
export default PingbackContextManager
