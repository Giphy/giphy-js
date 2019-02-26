export default function getLastSearchResponseId() {
    try {
        const sessionIds = sessionStorage.getItem('responseIds')
        if (sessionIds) {
            const searchResponseIds = JSON.parse(sessionIds) || []
            return searchResponseIds[searchResponseIds.length - 2]
        }
    } catch (e) {
        console.error(e)
    }
}

export function addLastSearchResponseId(searchResponseId: string) {
    try {
        const sessionIds = sessionStorage.getItem('responseIds')
        if (!sessionIds) {
            const responseIds: string[] = []
            responseIds.push(searchResponseId)
            sessionStorage.setItem('responseIds', JSON.stringify(responseIds))
        } else {
            var searchResponseIds = JSON.parse(sessionIds)
            if (searchResponseIds[searchResponseIds.length - 1] !== searchResponseId) {
                searchResponseIds.push(searchResponseId)
                sessionStorage.setItem('responseIds', JSON.stringify(searchResponseIds))
            }
        }
    } catch (e) {
        console.error(e)
    }
}
