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

#### example
JavaScript configuration file example `ec.config.mjs`

```
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
```

`template.html`

```
<!DOCTYPE html>
<html>
<head>
  <title>hello-example</title>
</head>
<body>
  <% if (message) { %>
    <h1><%= message.hello %><%- message.name %> <%= message.now %></h1>
  <% } %>
</body>
</html>
```

Then run the `easy-code` command:

```
ecode hello
```

output: output.html

```
<!DOCTYPE html>
<html>
<head>
  <title>hello-example</title>
</head>
<body>
  
    <h1>hello<span>easy-code</span> 1660637317567</h1>
  
</body>
</html>
```

[More example](https://github.com/kooofly/easy-code/tree/main/example)

## Command-line arguments to `easy-code`

```
Usage: ecode [options]

Options:
  -V, --version                 output the version number
  -k, --key <config key>        config key
  -p, --params <custom params>  custom params. "ecode hello abc" or "ecode hello foo=1^bar=2"
  -c, --config <config file>    config file, default is ec.config.mjs
  -d, --debug <debug>           output debug info
  -h, --help                    display help for command
```

If you installed `easy-code` globally, run the `easy-code` command:

```
ecode -k YourCustomKey -p YourParams
```

or

```
ecode YourCustomKey YourParams
```

## Configuration

```
{
  [CustomKey: string]: {
    watchPaths: (string or array of strings) Paths to files, dirs to be watched recursively, or glob patterns.

    beforeCreate: (context: Context, next) => {
      next([{
        format: 
          boolean or Customize formatter function (v: string) => string or IPrettierOptions object.
            true: equivalent to executing the method prettier.format(fileData, { semi: false, parser: 'babel', singleQuote: true, trailingComma: 'none' })
            IPrettierOptions: https://prettier.io/docs/en/options.html
          default is false.
        
        override: boolean. default is false. 
          If set to true will overwrite the file regardless of whether the file exists

        template: template path or template string. 
          path example: '@/template.js'; 
          string example: 'hello <%- foo %>'; more detail: https://ejs.co/#docs

        output: output path. 
          example: '@/output.js' or 'output.js'

        params: object
          example: { foo: 1, bar: 2 }

      }])
    }

    afterCreate: (
      context: Context,
      results: file contents
    ) => void
    
    onWatch?: (
      {
        event: Available events: add, addDir, change, unlink, unlinkDir, ready, raw, error.
        path: path.
        stats: https://nodejs.org/api/fs.html#class-fsstats
      },
      next
    ) => {
      // If you execute the `next` method, the configuration will be executed immediately
      // IF not it will go default process
      next()
    }
  }
}

interface Config {
  [customKey: string]: Options
}

interface Options {
  watchPaths: string | string[]
  beforeCreate: (context: Context, next) => void,
  afterCreate: (context: Context, results: Array<string>) => void
  onWatch?: ({ event, path, stats }, next) => void
}

type BeforeCreateNextOptions = BeforeCreateNextOption[] | BeforeCreateNextOption
interface BeforeCreateNextOption {
  format: boolean | ((v: string) => string) | IPrettierOptions
  override: boolean
  template: string
  output: string
  params: Record<string, any>
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
    createRequire: Function /* module.createRequire */
    ejs: {/* https://ejs.co/#docs */}
    fastGlob: {/* https://www.npmjs.com/package/fast-glob */}
    logMethods: {
      info: Function
      warn: Function
      error: Function
    }
  }
  name: string
  watchPaths?: string | string[]
}

type Item = {
  id: string
  name: string
  path: string
  relativePath: string
  extension: string
  type: 'file' | 'directory'
}

interface IPrettierOptions {/* https://prettier.io/docs/en/options.html */}

type TreeObject = Object
```

### Dependents

* EJS: [https://ejs.co](https://ejs.co/)
* Prettier: [https://www.npmjs.com/package/prettier](https://www.npmjs.com/package/prettier)
* fast-glob: [https://www.npmjs.com/package/fast-glob](https://www.npmjs.com/package/fast-glob)