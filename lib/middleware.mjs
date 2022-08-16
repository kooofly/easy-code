import compose from 'koa-compose'

export default class Middleware {
  constructor (options) {
    this.middlewares = []
    this.handlerCount = 0
    this.isReady = false
    this.autoNext = options ? options.autoNext : false
  }

  ready () {
    this.isReady = true
  }

  use (middleware) {
    this.middlewares.push(middleware)
  }

  handler (ctx) {
    const h = compose(this.middlewares)
    return h(ctx)
  }
}