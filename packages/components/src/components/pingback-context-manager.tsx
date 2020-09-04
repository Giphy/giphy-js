import { mergeAttribute, PingbackAttribute } from '@giphy/js-analytics'
import { createContext, FunctionComponent, h } from 'preact'
import { useContext } from 'preact/hooks'

type PingbackContextProps = { attributes: PingbackAttribute[] }
export const PingbackContext = createContext({} as PingbackContextProps)

const PingbackContextManager: FunctionComponent<PingbackContextProps> = ({ attributes, children }) => {
    const { attributes: parentAttributes = [] } = useContext(PingbackContext)
    return (
        <PingbackContext.Provider
            value={{ attributes: mergeAttribute([...parentAttributes, ...attributes], 'layout_type') }}
        >
            {children}
        </PingbackContext.Provider>
    )
}
export default PingbackContextManager
