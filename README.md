# easy-code
`easy-code` is a tool for generate files use template.

For example:
* you can use it to generate model file
* you can use it to generate SPA route file, and watch folder change
* you can use it to generate other custom file etc.

# Installation

To install `easy-code` globally

```
npm install -g @kooofly/easy-code
```

To add `easy-code` as a dependency to you project

```
npm install --save-dev @kooofly/easy-code
```

# Usage

## Configuring `easy-code` with a configuration file

You can provide a javascript that exports a single configuration object. default file name is `ec.config.mjs`.

To run `easy-code` with a configuration file, use the -c command-line option

If you installed `easy-code` globally, run the `easy-code` command:

```
ecode -c /path/to/conf.mjs -k YourCustomKey
```

JavaScript configuration file example `ec.config.mjs`
```
export default {
  hello: {
    async beforeCreate (ctx) {
      const { require } = ctx.helper
      const examplePackageJson = require('../package.json')
      return [{
        templatePath: 'hello-example/template.html',
        outputPath: 'hello-example/output.html',
        params: {
          message: {
            hello: 'hello',
            name: '<span>easy-code</span>'
          },
          version: examplePackageJson.version
        }
      }]
    },
    async afterCreate (ctx) {
      ctx.helper.logMethods.info('afterCreate custom info')
    }
  }
}
```

you can configure you own `package.json` like this:

```
{
  ...
  "scripts": {
    "hello": "ecode - -k hello"
    "watchAndAutoCreateRoutes": "ecode - -k auto-router"
    "useTemplateToCreateFileByFileName": "ecode - -k command -p"
  }
  ...
}
```
then you can run the command:
```
npm run watchAndAutoCreateRoutes
npm run useTemplateToCreateFileByFileName YourFileName
```
[More example](https://github.com/kooofly/easy-code/tree/main/example)

## Command-line arguments to `easy-code`
| Options                          | Description                          |
| :------------------------------- | :----------------------------------- |
| -c `<value>`, --config `<value>` | config file, default `ec.config.mjs` |
| -k `<value>`, --key `<value>`    | config key                           |
| -p `<value>`, --params `<value>` | custom params                        |
| -V, --version                    | output the version number            |
| -h, --help                       | display help for command             |


## Configuration

### Options
```
interface Options {
  beforeCreate: (context: Context) => Promise<BeforeCreateReturns>,
  afterCreate: (context: Context) => void
  prettier: IPrettierOptions | boolean,
}

interface Context {
  helper: {
    firstToUpperCase: (str: string) => string
    firstToLowerCase: (str: string) => string
    getFileName: (name: string, operator?: string) => string
    getExtension: (name: string, operator?: string) => string
    importModule: (filePath: string) => Promise<any>
    getFileContent: (filePath: string) => Promise<string>
    getFileList: (folderPath: string) =>  Promise<{ filePath: string, fileName: string, fileExtension: string }[]>
    getDirTree: (folderPath: string, onEachFile: (item: Item, path, stats) => void, onEachDirectory: (item: Item, path, stats) => void) =>  Promise<TreeObject>
    require: (path: string) => any
    getProgramOpts: () => { params?: string, key: string }
    ejs: {/* ... */}
    fastGlob: {/* ... */}
    logMethods: {
      info: Function
      warn: Function
      error: Function
    }
    
  }
  name: string
  watchDir?: string
}

type Item = {
  id: string
  name: string
  path: string
  relativePath: string
  extension: string
  type: 'file' | 'directory'
}

type BeforeCreateReturns = BeforeCreateReturn[] | BeforeCreateReturn

interface BeforeCreateReturn {
  templatePath?: string
  templateString?: string
  outputPath: string
  params: Record<string, any>
  beforeWriteFile: (fileContent: string) => string
}

interface IPrettierOptions {/* ... */}

type TreeObject = {/* ... */}
```
### Example

JavaScript configuration file example `ec.config.mjs`
```
export default {
  command: {
    async beforeCreate (ctx) {
      const { name, helper } = ctx
      const { require, getProgramOpts } = helper
      const programOpts = getProgramOpts()
      const { params } = programOpts
      const pkg = require('./package.json')
      console.log({ name, programOpts, pkg })
      return [{
        templatePath: 'command-example/template.html',
        outputPath: `command-example/${params}.html`,
        params: {
          title: params,
          version: pkg.version
        }
      }]
    },
  }
}
```

### Dependents

* EJS: [https://ejs.co](https://ejs.co/)
* Prettier: [https://www.npmjs.com/package/prettier](https://www.npmjs.com/package/prettier)
* fast-glob: [https://www.npmjs.com/package/fast-glob](https://www.npmjs.com/package/fast-glob)