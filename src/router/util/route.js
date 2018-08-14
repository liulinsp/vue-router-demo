/**
 *
 * @author liu_lin_sp@126.com
 * @date 2018/8/10
 */
const trailingSlashRE = /\/?$/
export function createRoute (record, location, redirectedFrom, router) {
    let query = location.query || {}
    try {
        query = clone(query)
    } catch (e) {}

    const route = {
        name: location.name || (record && record.name),
        path: location.path || '/',
        hash: location.hash || '',
        query,
        params: location.params || {},
        fullPath: getFullPath(location),
        matched: record ? formatMatch(record) : []
    }
    if (redirectedFrom) {
        route.redirectedFrom = getFullPath(redirectedFrom)
    }
    return Object.freeze(route)
}

export const START = createRoute(null, {
    path: '/'
})

export function isSameRoute (a, b) {
    if (b === START) {
        return a === b
    } else if (!b) {
        return false
    } else if (a.path && b.path) {
        return (
            a.path.replace(trailingSlashRE, '') === b.path.replace(trailingSlashRE, '') &&
            a.hash === b.hash &&
            isObjectEqual(a.query, b.query)
        )
    } else if (a.name && b.name) {
        return (
            a.name === b.name &&
            a.hash === b.hash &&
            isObjectEqual(a.query, b.query) &&
            isObjectEqual(a.params, b.params)
        )
    } else {
        return false
    }
}

function clone (value) {
    if (Array.isArray(value)) {
        return value.map(clone)
    } else if (value && typeof value === 'object') {
        const res = {}
        for (const key in value) {
            res[key] = clone(value[key])
        }
        return res
    } else {
        return value
    }
}
function getFullPath ( { path, query = {}, hash = '' } ){
    return (path || '/') + stringifyQuery(query) + hash
}

function stringifyQuery (obj) {
    const res = obj ? Object.keys(obj).map(key => {
        const val = obj[key]

        if (val === undefined) {
            return ''
        }

        if (val === null) {
            return encode(key)
        }

        if (Array.isArray(val)) {
            const result = []
            val.forEach(val2 => {
                if (val2 === undefined) {
                    return
                }
                if (val2 === null) {
                    result.push(encode(key))
                } else {
                    result.push(encode(key) + '=' + encode(val2))
                }
            })
            return result.join('&')
        }

        return encode(key) + '=' + encode(val)
    }).filter(x => x.length > 0).join('&') : null
    return res ? `?${res}` : ''
}

function formatMatch (record) {
    const res = []
    while (record) {
        res.unshift(record)
        record = record.parent
    }
    return res
}

function isObjectEqual (a = {}, b = {}) {
    // handle null value #1566
    if (!a || !b) return a === b
    const aKeys = Object.keys(a)
    const bKeys = Object.keys(b)
    if (aKeys.length !== bKeys.length) {
        return false
    }
    return aKeys.every(key => {
        const aVal = a[key]
        const bVal = b[key]
        // check nested equality
        if (typeof aVal === 'object' && typeof bVal === 'object') {
            return isObjectEqual(aVal, bVal)
        }
        return String(aVal) === String(bVal)
    })
}
