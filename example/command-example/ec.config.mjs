export default {
  command: {
    async beforeCreate (ctx, next) {
      const { name, helper, commandOptions } = ctx
      const { createRequire, firstToUpperCase } = helper
      const { params } = commandOptions
      const pkg = createRequire(import.meta.url)('./package.json')
      next([{
        template: '@/template.html',
        output: `@/${firstToUpperCase(params)}.html`,
        params: {
          name: pkg.name,
          page: params,
          key: name,
        }
      }])
    },
  }
}