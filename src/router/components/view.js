/**
 * RouterView 组件
 * @author liu_lin_sp@126.com
 * @date 2018/8/10
 */
// 函数式组件【是无状态 (没有响应式数据)，无实例 (没有 this 上下文)的组件】
// 函数式组件不会出现在 Vue devtools 的组件树
export default {
    name: 'RouterView',
    // 函数式组件: 无状态 (没有响应式数据)，无实例 (没有 this 上下文)的组件
    functional: true,
    props: {
        name: {
            type: String,
            default: 'default'
        }
    },

    // 第一个参数为 createElement 函数， 使用该函数可以生成模板
    // 第二个参数为 content 上下文对象
    // 1. props : 提供所有 prop 的对象
    // 2. children: VNode 子节点的数组
    // 3. parent: 对父组件的引用
    // 4. data: 传递给组件的数据对象，作为 createElement 的第二个参数传入组件
    render (createElement, { props, children, parent, data }) {
        console.log('RouterView render ()')
        data.routerView = true

        const h = parent.$createElement
        const name = props.name
        const route = parent.$route
        const cache = parent._routerViewCache || (parent._routerViewCache = {})

        let depth = 0 // 组件的深度
        while (parent && parent._routerRoot !== parent) {
            if (parent.$vnode && parent.$vnode.data.routerView) {
                depth++
            }
            parent = parent.$parent
        }
        data.routerViewDepth = depth

        const matched = route.matched[depth]
        // 如果没有匹配的路由，渲染一个空节点
        if (!matched) {
            cache[name] = null
            return h()
        }

        const component = cache[name] = matched.components[name]

        return h(component, data, children)
    }
}