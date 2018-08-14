/**
 *
 * @author liu_lin_sp@126.com
 * @date 2018/8/10
 */
import History from './base'
import { pushState, replaceState, supportsPushState } from '../util/push-state'

export default class HashHistory extends History{
    constructor (router) {
        super(router)
    }

    // 设置监听
    setupListeners () {
        const router = this.router
        window.addEventListener(supportsPushState ? 'popstate' : 'hashchange', () => {
            const current = this.current
            this.transitionTo(getHash(), route => {
                if (!supportsPushState) {
                    replaceHash(route.fullPath)
                }
            })
        })
    }

    // 获取当前路由地址
    getCurrentLocation () {
        return getHash()
    }

    ensureURL (push) {
        const current = this.current.fullPath
        if (getHash() !== current) {
            push ? pushHash(current) : replaceHash(current)
        }
    }

    push (location, onComplete, onAbort) {
        const { current: fromRoute } = this
        this.transitionTo(location, route => {
            console.log('transitionTo pushHash')
            pushHash(route.fullPath)
            onComplete && onComplete(route)
        }, onAbort)
    }

    replace (location, onComplete, onAbort) {
        const { current: fromRoute } = this
        this.transitionTo(location, route => {
            replaceHash(route.fullPath)
            onComplete && onComplete(route)
        }, onAbort)
    }

}
export function getHash (){
    const href = window.location.href
    const index = href.indexOf('#')
    return index === -1 ? '' : href.slice(index + 1)
}

function pushHash (path) {
    if (supportsPushState) {
        pushState(getUrl(path))
    } else {
        window.location.hash = path
    }
}

function replaceHash (path) {
    if (supportsPushState) {
        replaceState(getUrl(path))
    } else {
        window.location.replace(getUrl(path))
    }
}

function getUrl (path) {
    const href = window.location.href
    const i = href.indexOf('#')
    const base = i >= 0 ? href.slice(0, i) : href
    return `${base}#${path}`
}