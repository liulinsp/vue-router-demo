/**
 *
 * @author liu_lin_sp@126.com
 * @date 2018/8/10
 */

import Regexp from 'path-to-regexp'

// $flow-disable-line
const regexpCompileCache = Object.create(null)

export function fillParams (
    path,
    params,
    routeMsg
) {
    try {
        const filler =
            regexpCompileCache[path] ||
            (regexpCompileCache[path] = Regexp.compile(path))
        return filler(params || {}, { pretty: true })
    } catch (e) {
        if (process.env.NODE_ENV !== 'production') {
            warn(false, `missing param for ${routeMsg}: ${e.message}`)
        }
        return ''
    }
}
