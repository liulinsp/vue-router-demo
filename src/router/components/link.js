/**
 * RouterLink 组件
 * @author liu_lin_sp@126.com
 * @date 2018/8/10
 */
export default {
    name: 'RouterLink',
    props: {
        to: {
            type: [String, Object],
            required: true
        },
        replace: Boolean
    },
    render (createElement) {
        console.log('RouterLink render()')
        const router = this.$router
        const current = this.$route
        const { location, href } = router.resolve(this.to, current, this.append)
        let data = {
            attrs: { href },
            on: {
                click: (e) => {
                    e.preventDefault()
                    if (this.replace) {
                        router.replace(location)
                    } else {
                        router.push(location)
                    }
                    console.log('RouterLink click')
                }
            }
        }
        return createElement('a', data, this.$slots.default)
    }
}