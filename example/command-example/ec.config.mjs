export default {
  command: {
    async beforeCreate (ctx, next) {
      const { name, helper, commandOptions } = ctx
      const { createRequire, firstToUpperCase } = helper
      const { params } = commandOptions
      const pkg = createRequire(import.meta.url)('./package.json')
      next([{
        template: '@/command-example/template.html',
        output: `@/command-example/${firstToUpperCase(params)}.html`,
        params: {
          name: pkg.name,
          page: params,
          key: name,
        }
      }])
    },
  }
}