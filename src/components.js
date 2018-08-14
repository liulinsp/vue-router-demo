/**
 *
 * @author liu_lin_sp@126.com
 * @date 2018/8/14
 */
export const App = {
    template: `
                <div>
                    <RouterLink to="/index">首页</RouterLink>
                    <RouterLink to="/about">关于我们</RouterLink>
                    <RouterView></RouterView>
                </div>
            `
}

export const Index = {
    template: `<div style="width: 500px;height: 400px; margin: 20px auto; background-color: #eafffc">
                    这是首页
                    <RouterLink to="/index/detail">详情</RouterLink>
                    <RouterView></RouterView>
                </div>`
}

export const About = {
    template: '<div style="width: 500px;height: 400px; margin: 20px auto; background-color: beige">这是关于我们页</div>'
}

export const Detail = {
    template: '<div style="width: 300px;height: 300px; margin: 20px auto; background-color: #f5dde6">这是详情页</div>'
}
