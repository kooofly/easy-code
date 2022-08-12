export default {
  readme: {
    async beforeCreate (ctx) {
      const { helper: { getFileContent } } = ctx
      const [helloExample, commandExample, dts] = await Promise.all([
        getFileContent('example/hello-example/config.mjs'),
        getFileContent('example/command-example/config.mjs'),
        getFileContent('d.ts')
      ])
      return {
        templatePath: 'script/readme.template.md',
        outputPath: './README.md',
        params: {
          helloExample,
          commandExample,
          dts
        }
      }
    }
  },
}