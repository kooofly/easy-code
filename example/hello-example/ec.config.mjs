export default {
  hello: {
    async beforeCreate (ctx, next) {
      next([{
        override: true,
        template: '@/template.html',
        output: '@/output.html',
        params: {
          message: {
            hello: 'hello',
            name: '<span>easy-code</span>',
            now: Date.now()
          }
        }
      }])
    }
  }
}