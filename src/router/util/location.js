/**
 *
 * @author liu_lin_sp@126.com
 * @date 2018/8/10
 */
import { parsePath, resolvePath } from './path'
import { fillParams } from './params'
export function normalizeLocation (
    raw,
    current,
    append,
    router
) {
    let next = typeof raw === 'string' ? { path: raw } : raw
    // named target
    if (next.name || next._normalized) {
        return next
    }

    // relative params
    if (!next.path && next.params && current) {
        next = extend({}, next)
        next._normalized = true
        const params = extend(extend({}, current.params), next.params)
        if (current.name) {
            next.name = current.name
            next.params = params
        } else if (current.matched.length) {
            const rawPath = current.matched[current.matched.length - 1].path
            next.path = fillParams(rawPath, params, `path ${current.path}`)
        }
        return next
    }

    const parsedPath = parsePath(next.path || '')
    const basePath = (current && current.path) || '/'
    const path = parsedPath.path
        ? resolvePath(parsedPath.path, basePath, append || next.append)
        : basePath

    const query = resolveQuery(
        parsedPath.query,
        next.query,
        router && router.options.parseQuery
    )

    let hash = next.hash || parsedPath.hash
    if (hash && hash.charAt(0) !== '#') {
        hash = `#${hash}`
    }

    return {
        _normalized: true,
        path,
        query,
        hash
    }
}

function extend (a, b) {
    for (const key in b) {
        a[key] = b[key]
    }
    return a
}

function resolveQuery (
    query,
    extraQuery = {},
    _parseQuery
){
    const parse = _parseQuery || parseQuery
    let parsedQuery
    try {
        parsedQuery = parse(query || '')
    } catch (e) {
        process.env.NODE_ENV !== 'production' && warn(false, e.message)
        parsedQuery = {}
    }
    for (const key in extraQuery) {
        parsedQuery[key] = extraQuery[key]
    }
    return parsedQuery
}

function parseQuery (query) {
    const res = {}

    query = query.trim().replace(/^(\?|#|&)/, '')

    if (!query) {
        return res
    }

    query.split('&').forEach(param => {
        const parts = param.replace(/\+/g, ' ').split('=')
        const key = decode(parts.shift())
        const val = parts.length > 0
            ? decode(parts.join('='))
            : null

        if (res[key] === undefined) {
            res[key] = val
        } else if (Array.isArray(res[key])) {
            res[key].push(val)
        } else {
            res[key] = [res[key], val]
        }
    })

    return res
}