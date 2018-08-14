/**
 *
 * @author linliu21
 * @date 2018/8/8
 */
const express = require('express')
const path = require('path')
const app = express()
const http = require('http')
const history = require('connect-history-api-fallback')
app.use(history({rewrites: [
    {
        from: /^\/page\/.*$/,
        to: '/index.html'
    }
]}))
app.use(express.static(path.resolve(__dirname, './dist')))
const server = http.createServer(app)
const conf = {
    ip: 'localhost',
    port: 3333
}
server.listen(conf.port, conf.ip, function (error) {
    if (error) {
        console.error('Unable to listen for connections', error)
        process.exit(10)
    }
    console.info('listening on http://' +
        conf.ip + ':' + conf.port)
})