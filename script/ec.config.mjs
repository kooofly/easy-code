export default {
  readme: {
    async beforeCreate (ctx, next) {
      const { helper: { getFileContent } } = ctx
      const [helloConfig, helloTemplate, helloOutput, dts] = await Promise.all([
        getFileContent('example/hello-example/ec.config.mjs'),
        getFileContent('example/hello-example/template.html'),
        getFileContent('example/hello-example/output.html'),
        getFileContent('d.ts')
      ])
      next({
        override: true,
        template: '@/script/readme.template.md',
        output: './README.md',
        params: {
          helloConfig,
          helloTemplate,
          helloOutput,
          dts
        }
      })
    }
  },
}