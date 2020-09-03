import { PingbackAttribute } from './types'

const mergeAttribute = (attributes: PingbackAttribute[], key: string) => {
    // attributes we need to merge
    const toMerge: PingbackAttribute[] = []

    // remove the attributes that match the key
    const result = attributes.filter((val) => {
        if (val.key === key) {
            toMerge.push(val)
            return false
        }
        return true
    })

    // if we have any, merge'em
    if (toMerge.length > 0) {
        const value = toMerge.map((val) => val.value).join(', ')
        result.push({ key, value })
    }

    return result
}

export default mergeAttribute
