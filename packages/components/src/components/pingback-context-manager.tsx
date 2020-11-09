import { mergeAttributes, PingbackAttributes } from '@giphy/js-analytics'
import { createContext, FunctionComponent, h } from 'preact'
import { useContext } from 'preact/hooks'

type PingbackContextProps = { attributes: PingbackAttributes }
export const PingbackContext = createContext({} as PingbackContextProps)

const PingbackContextManager: FunctionComponent<PingbackContextProps> = ({ attributes, children }) => {
    const { attributes: parentAttributes = {} } = useContext(PingbackContext)
    return (
        <PingbackContext.Provider value={{ attributes: mergeAttributes(parentAttributes, attributes, 'layout_type') }}>
            {children}
        </PingbackContext.Provider>
    )
}
export default PingbackContextManager
