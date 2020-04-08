import { PingbackRequestAction, PingbackActionType, PingbackAttribute } from './types'

export function getAction(
    action_type: PingbackActionType,
    gif_id: string,
    tid?: string,
    position?: ClientRect,
    attributes: PingbackAttribute[] = []
): PingbackRequestAction {
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
