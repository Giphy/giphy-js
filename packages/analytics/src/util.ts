import { PingbackActionType, PingbackAttribute, PingbackRequestAction } from './types'

export function getAction(
    action_type: PingbackActionType,
    gif_id: string,
    tid?: string,
    position?: ClientRect,
    attributes: PingbackAttribute[] = []
): PingbackRequestAction {
    if (
        position &&
        // apppend position only if it's not passed as a custom attribute
        !attributes.some(attributes => attributes.key === 'position')
    ) {
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
