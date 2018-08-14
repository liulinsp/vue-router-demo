/**
 *
 * @author liu_lin_sp@126.com
 * @date 2018/8/10
 */
import History from './base'
import { pushState, replaceState } from '../util/push-state'
import { START } from '../util/route'
import {cleanPath} from '../util/path'

export default class HTML5History extends History{
    constructor (router) {
        super(router)
        const initLocation = getLocation()
        window.addEventListener('popstate', e => {
            const current = this.current

            // Avoiding first `popstate` event dispatched in some browsers but first
            // history route not updated since async guard at the same time.
            const location = getLocation()
            if (this.current === START && location === initLocation) {
                return
            }

            this.transitionTo(location, route => {
                console.log('HTML5History transitionTo', route)
            })
        })
    }

    // 获取当前路由地址
    getCurrentLocation () {
        return getLocation()
    }

    ensureURL (push) {
        console.log('HTML5History ensureURL')
        if (getLocation() !== this.current.fullPath) {
            const current = cleanPath(this.current.fullPath)
            push ? pushState(current) : replaceState(current)
        }
    }

    push (location, onComplete, onAbort) {
        const { current: fromRoute } = this
        this.transitionTo(location, route => {
            pushState(route.fullPath)
            onComplete && onComplete(route)
        }, onAbort)
    }

    replace (location, onComplete, onAbort) {
        const { current: fromRoute } = this
        this.transitionTo(location, route => {
            replaceState(route.fullPath)
            onComplete && onComplete(route)
        }, onAbort)
    }
}
export function getLocation () {
    let path = window.location.pathname
    return (path || '/') + window.location.search + window.location.hash
}