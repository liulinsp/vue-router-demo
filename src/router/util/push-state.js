/**
 *
 * @author liu_lin_sp@126.com
 * @date 2018/8/10
 */
const inBrowser = typeof window !== 'undefined'

export const supportsPushState = inBrowser && (function () {
    const ua = window.navigator.userAgent

    if (
        (ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) &&
        ua.indexOf('Mobile Safari') !== -1 &&
        ua.indexOf('Chrome') === -1 &&
        ua.indexOf('Windows Phone') === -1
    ) {
        return false
    }

    return window.history && 'pushState' in window.history
})()

let _key = genKey()

function genKey () {
    return Date.now().toFixed(3)
}

export function getStateKey () {
    return _key
}

export function setStateKey (key) {
    _key = key
}

export function pushState (url, replace) {
    // try...catch the pushState call to get around Safari
    // DOM Exception 18 where it limits to 100 pushState calls
    const history = window.history
    try {
        if (replace) {
            history.replaceState({ key: _key }, '', url)
        } else {
            _key = genKey()
            history.pushState({ key: _key }, '', url)
        }
    } catch (e) {
        window.location[replace ? 'replace' : 'assign'](url)
    }
}

export function replaceState (url) {
    pushState(url, true)
}