const isPro = Object.is(process.env.NODE_ENV, 'production')

module.exports = {
    baseUrl: isPro ? 'http://192.168.1.104:8088' : 'api/'
}