import { mergeAttributes, PingbackAttributes } from '@giphy/js-analytics'
import { PingbackEventType } from '@giphy/js-types'
import { createContext, FunctionComponent, h } from 'preact'
import { useContext } from 'preact/hooks'

type PingbackContextProps = { attributes: PingbackAttributes; eventType?: PingbackEventType }
export const PingbackContext = createContext({} as PingbackContextProps)

const PingbackContextManager: FunctionComponent<PingbackContextProps> = ({ eventType, attributes, children }) => {
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
