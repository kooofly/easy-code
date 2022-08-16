import fse from 'fs-extra'
import module  from 'module'
const { createRequire } = module
const require = createRequire(import.meta.url)
const packageJson = require('../../package.json')

export default async function (ctx, next) {
  const start = Date.now()
  const {
    beforeCreateOptions,
    helper: {
      logMethods: { warn, info },
      ejs,
      isFunction,
      isECodePath,
      getECodePath,
      getFileContent,
      _getFormatter
    },
    config: { afterCreate }
  } = ctx
  await Promise.all(beforeCreateOptions.map(async opt => {
    const {
			template,
			params,
			format,
			output,
			override
		} = opt
		let temp = template
		if (isECodePath(template)) {
			temp = await getFileContent(getECodePath(template))
		}
		let fileContent = ejs.compile(temp, {})(params)
		fileContent = _getFormatter(format)(fileContent)
		const filePath = getECodePath(output)
		if (!override && fse.pathExistsSync(filePath)) {
			warn(`${filePath} exists and option override is false`)
			return fileContent
		}
		await fse.outputFile(filePath, fileContent)
		return fileContent
  })).then(rs => {
		info(`[${packageJson.name}@${packageJson.version}]`, 'success', `${Date.now() - start}ms`)
		isFunction(afterCreate) && afterCreate(context, rs)
	})
  next()
}