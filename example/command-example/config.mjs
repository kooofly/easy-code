export default {
  command: {
    async beforeCreate (ctx) {
      const { name, helper } = ctx
      const { createRequire, getProgramOpts, firstToUpperCase } = helper
      const programOpts = getProgramOpts()
      const { params } = programOpts
      const pkg = createRequire(import.meta.url)('./package.json')
      console.log({ name, programOpts, pkg })
      return [{
        templatePath: 'command-example/template.html',
        outputPath: `command-example/${firstToUpperCase(params)}.html`,
        params: {
          name: pkg.name,
          page: params,
          key: name,
        }
      }]
    },
  }
}