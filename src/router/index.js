/**
 *
 * @author liu_lin_sp@126.com
 * @date 2018/8/10
 */
import {install} from './install.js'
import HashHistory from './history/hash.js'
import HTML5History from './history/html5.js'
import createMatcher from './create-matcher.js'
import {normalizeLocation} from './util/location.js'
import {cleanPath} from './util/path.js'

export default class VueRouter{
    constructor (options) {
        this.app = null
        this.apps = []
        this.options = options
        // 路由匹配工具
        this.matcher = createMatcher(options.routes || [], this)
        // 路由模式，默认为：hash
        this.mode = options.mode || 'hash'
        // 根据不同的路由模式创建history路由匹配对象
        switch (this.mode) {
            case 'hash':
                this.history = new HashHistory(this)
                break
            case 'history':
                this.history = new HTML5History(this)
                break
            default:
                console.error('mode 值错误，只能是 hash 或 history')
        }
    }

    // 初始化路由对象
    init (app) {
        this.apps.push(app)
        this.app = app
        const history = this.history
        // 路由转换
        if (history instanceof HTML5History) {
            history.transitionTo(history.getCurrentLocation())
        } else if (history instanceof HashHistory) {
            // 设置hash路由的监听
            const setupHashListener = () => {
                history.setupListeners()
            }
            history.transitionTo(
                history.getCurrentLocation(),
                setupHashListener // 回调函数
            )
        }

        // 设置路由的监听，路由切换后设置根节点的_route【重要】（ _route 属性已实现双向绑定，路由改变时触发组件渲染）
        history.listen(route => {
            this.apps.forEach((app) => {
                app._route = route
            })
        })
    }

    match (raw, current, redirectedFrom) {
        return this.matcher.match(raw, current, redirectedFrom)
    }

    resolve (to, current, append){
        const location = normalizeLocation(
            to,
            current || this.history.current,
            append,
            this
        )
        const route = this.match(location, current)
        const fullPath = route.redirectedFrom || route.fullPath
        const base = this.history.base
        const href = createHref(base, fullPath, this.mode)
        return {
            location,
            route,
            href,
            // for backwards compat
            normalizedTo: location,
            resolved: route
        }
    }
    push (location, onComplete, onAbort) {
        console.log('push', location)
        this.history.push(location, onComplete, onAbort)
    }

    replace (location, onComplete, onAbort) {
        this.history.replace(location, onComplete, onAbort)
    }
}


function createHref (base, fullPath, mode) {
    var path = mode === 'hash' ? '#' + fullPath : fullPath
    return base ? cleanPath(base + '/' + path) : path
}


VueRouter.install = install