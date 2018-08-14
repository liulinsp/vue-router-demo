/**
 *
 * @author liu_lin_sp@126.com
 * @date 2018/8/10
 */

import View from './components/view.js'
import Link from './components/link.js'
export function install (Vue) {
    // 混入
    Vue.mixin({
        beforeCreate () {
            //  如果是根节点（判断初始化选项中是否存在router对象，如果有说明是根节点）
            if (this.$options.router !== undefined) {
                this._routerRoot = this // 根路由设置为自己
                this._router = this.$options.router // 路由对象
                this._router.init(this) // 初始化路由
                // 实现 _route 属性的双向绑定，路由改变时触发组件渲染【重要】
                Vue.util.defineReactive(this, '_route', this._router.history.current)
            } else { // 其他子节点
                // 设置路由的根节点，用于计算 router-view 层级
                this._routerRoot = (this.$parent && this.$parent._routerRoot) || this
            }
        }
    })

    // 定义全局属性 $router (router实例)
    Object.defineProperty(Vue.prototype, '$router', {
        get () { return this._routerRoot._router }
    })
    // 定义全局属性 $route (当前路由信息对象)
    Object.defineProperty(Vue.prototype, '$route', {
        get () { return this._routerRoot._route }
    })

    // 注册全局组件 RouterView 和 RouterLink
    Vue.component('RouterView', View)
    Vue.component('RouterLink', Link)
}