import Middleware from './lib/middleware.mjs'

const m = new Middleware()

const ctx = {
  a: 1
}
m.use((ctx, next) => {
  next({ b: 2 })
})
m.use((ctx, next, c, d) => {
  console.log(ctx, next, c, d)
})
m.handler(ctx)