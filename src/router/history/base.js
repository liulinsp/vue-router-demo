/**
 *
 * @author liu_lin_sp@126.com
 * @date 2018/8/10
 */
import { START, isSameRoute } from '../util/route.js'
import { runQueue } from '../util/async'

export default class History {
    constructor (router) {
        this.router = router
        this.current = START
    }
    listen (cb) {
        this.cb = cb
    }

    // 路由切换
    transitionTo (location, onComplete) {
        const route = this.router.match(location, this.current)
        this.confirmTransition(route, () => {
            this.updateRoute(route)
            onComplete && onComplete(route)
            this.ensureURL()
        })
    }

    // 确认是否切换，如果相同路由则不处理
    confirmTransition (route, onComplete) {
        const current = this.current
        // 如果相同路由就不处理
        if (isSameRoute(route, current) &&
            route.matched.length === current.matched.length) {
            this.ensureURL()
            return
        }
        onComplete(route)
    }

    // 更新路由，当前路由设为新路由
    updateRoute (route) {
        const prev = this.current
        this.current = route
        this.cb && this.cb(route) // 执行监听回调，设置根节点的_route，从而触发组件渲染【重要】
    }
}
