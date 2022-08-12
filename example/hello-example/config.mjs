export default {
  hello: {
    async beforeCreate (ctx) {
      return [{
        templatePath: 'hello-example/template.html',
        outputPath: 'hello-example/output.html',
        params: {
          message: {
            hello: 'hello ',
            name: '<span>easy-code</span>'
          }
        }
      }]
    }
  }
}