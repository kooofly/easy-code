export default {
  hello: {
    async beforeCreate (ctx, next) {
      const { name, commandOptions, helper, watchPaths } = ctx
      next({
        override: true,
        template: '@/template.html',
        output: '@/output.html',
        params: {
          message: {
            hello: name,
            name: '<span>easy-code</span>',
            now: Date.now()
          }
        }
      })
    }
  }
}