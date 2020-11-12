import { pick } from '@giphy/js-util'
import { PingbackAttributes } from './types'

const mergeAttribute = (attributes: PingbackAttributes, newAttributes: PingbackAttributes, key: string) => {
    const result1 = pick(attributes, [key])
    const result2 = pick(newAttributes, [key])
    if (result1[key] && result2[key]) {
        return { ...attributes, ...newAttributes, ...{ [key]: result1[key] + ', ' + result2[key] } }
    }
    return { ...attributes, ...newAttributes }
}

export default mergeAttribute
