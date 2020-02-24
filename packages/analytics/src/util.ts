import { PingbackRequestAction, PingbackActionType } from './types'
export type Attribute = {
    key: string
    value: string
}
export function getAction(
    action_type: PingbackActionType,
    gif_id: string,
    tid?: string,
    position?: ClientRect
): PingbackRequestAction {
    const attributes: Attribute[] = []
    if (position) {
        attributes.push({
            key: `position`,
            value: JSON.stringify(position),
        })
    }
    return {
        action_type,
        ts: Date.now(),
        gif_id,
        tid,
        attributes,
    }
}
