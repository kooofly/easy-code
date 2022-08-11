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

type TreeObject = Object