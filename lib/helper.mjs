
import path from 'path'
import fs from 'fs'
import fg from 'fast-glob'
import colors from 'colors'
import dirTree from 'directory-tree'
import * as _ejs from 'ejs'
import module  from 'module'
import prettier from 'prettier'
import importFresh from 'import-fresh'

export const isFunction = (v) => typeof v === 'function'

export const isObject = (val) => {
  return val != null && typeof val === 'object' && Array.isArray(val) === false
};

export const isBoolean = (v) => typeof v === 'boolean'

///// 模板处理
export const ejs = _ejs

///// 字符串处理
export const firstToUpperCase = ([first, ...rest]) => first.toUpperCase() + rest.join('')

export const firstToLowerCase = ([first, ...rest]) => first.toLowerCase() + rest.join('')

// 获取文件名
export const getFileName = (name, operator) => {
	return name.substring(0, name.lastIndexOf(operator || '.'))
}

// 获取后缀名
export const getExtension = (name, operator) => {
	return name.substring(name.lastIndexOf(operator || '.') + 1)
}

///// 日志
export const logMethods = (() => {
	const cfg = {
		silly: 'rainbow',
		input: 'grey',
		verbose: 'cyan',
		prompt: 'grey',
		info: 'green',
		data: 'grey',
		help: 'cyan',
		warn: 'yellow',
		debug: 'blue',
		error: 'red'
	}
	colors.setTheme(cfg)
	const result = {}
	for (const key in cfg) {
		if (Object.hasOwnProperty.call(cfg, key)) {
			result[key] = (...args) => {
				console.log(colors[key](...args))
			}
		}
	}
	result.log = console.log
	return result
})()

///// 文件处理

export const fastGlob = fg

export const importModule = async (filePath) => {
	const module = path.resolve(process.cwd(), filePath)
	return await import('file://' + module)
}

export const getFileContent = (filePath) => {
	return new Promise((resolve, reject) => {
		fs.readFile(
			getECodePath(filePath),
			{
				encoding: 'utf8'
			},
			(err, data) => {
				if (err) throw err
				resolve(data)
			})
	})
}

const _getFileList = async (filePath, rs, parent) => {
  rs = rs || []
  parent = parent ? parent : ''
  const files = await fs.promises.readdir(filePath)
  for (const file of files) {
    const fileDir = path.join(filePath, file)
    const stats = await fs.promises.stat(fileDir)
    const isFile = stats.isFile()
    const isDir = stats.isDirectory()
    if (isFile) {
      const input = `${parent}${file}`
      rs.push({
        filePath: input,
				fileName: getFileName(file),
				fileExtension: getExtension(file)
      });
    }
    if (isDir) {
      await _getFileList(fileDir, rs, `${parent + file}/`)
    }
  }
  return rs;
}

export const getFileList = async (folderPath) => {
	const fullPath = getECodePath(folderPath)
	return await _getFileList(fullPath)
}

export const getDirTree = async (folderPath, onEachFile, onEachDirectory) => {
	const id = (node) => node.relativePath.replace(node.extension, '').replace('/', '').replace(/\//g, '_')
	const dirTreePath = isECodePath(folderPath) ? folderPath.replace(/^@\//, '') : folderPath
	return new Promise((resolve, reject) => {
		resolve(
			dirTree(
				dirTreePath,
				{ attributes: ['type', 'extension'], normalizePath: true },
				(node, path, stats) => {
					node.relativePath = node.path.replace(folderPath, '')
					node.id = id(node)
					onEachFile && onEachFile(node, path, stats);
				},
				(node, path, stats) => {
					node.relativePath = node.path.replace(folderPath, '')
					node.id = id(node)
					onEachDirectory && onEachDirectory(node, path, stats);
				}
			),
		)
	})
}

export const breadthFirstTraversal = (root, call) => {
  if (!root) return
  let queue = Array.isArray(root) ? root : [root], current
  while ((current = queue.shift())) {
    const { children } = current
		call(current)
    children && queue.push(...children)
  }
}

export const traversalTree = breadthFirstTraversal

export const createRequire = module.createRequire

export const joinCwdPath = (path) => {
	return path.resolve(process.cwd(), filePath)
}

export const isECodePath = (filePath) => {
	return /^@\//.test(filePath)
}

export const getECodePath = (filePath) => {
	return isECodePath(filePath)
	? path.resolve(process.cwd(), filePath.replace(/^@\//, ''))
	: path.resolve(process.cwd(), filePath)
}

export const _getFormatter = (format) => {
	if (!format) {
		return (v) => v
	}

	if (isFunction(format)) {
		return format
	}

	const defaultPrettierOptions = {
		semi: false,
		parser: 'babel',
		singleQuote: true,
		trailingComma: 'none',
	}

	if (isBoolean(format) && format) {
		return (v) => prettier.format(v, defaultPrettierOptions)
	}

	if (isObject(format)) {
		return (v) => prettier.format(v, {
			...defaultPrettierOptions,
			...format
		})
	}
}

export const importDeCache = (m) => {
	return importFresh(path.resolve(process.cwd(), m))
}