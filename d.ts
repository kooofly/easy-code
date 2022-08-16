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