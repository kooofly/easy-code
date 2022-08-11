#!/usr/bin/env node

import path from 'path'
import fse from 'fs-extra'
import prettier from 'prettier'
import {
	Command
} from 'commander'
import watch from 'watch'
import * as helper from '../lib/helper.mjs'
import { createRequire } from 'module'
const { logMethods, importModule, getFileContent, ejs, getFileList, getDirTree } = helper
const { require } = helper
const packageJson = require('../package.json')
const program = new Command()

const getCommandOptions = () => {
	program.version(packageJson.version)
	program
		.option('-k, --key <config key>', 'config key')
		.option('-p, --params <custom params>', 'custom params')
		// .option('-f, --file <create file name>', 'create file name')
		.option('-c, --config <config file>', 'config file')
		.option('-d, --debug <debug>', 'debug')
	program.parse(process.argv)
	return program.opts()
}

const { info } = logMethods

const debug = () => {
	const co = getCommandOptions()
	return co.debug ? logMethods.debug : () => {}
}

const getConfig = async (options) => {
	const {
		config = 'ec.config.mjs', key
	} = options
	const cfg = await importModule(config)
	debug('[getConfig]', key, cfg.default[key])
	return cfg.default[key]
}

const getTemplate = getFileContent

// 1 input to 1 output
// 1 input to many outputs
// many inputs to many outputs
// many inputs to 1 output

const writeFile = (filePath, fileContent, prettierOptions) => {
	return new Promise((resolve) => {
		fileContent = prettierOptions ?
			prettier.format(fileContent, {
				semi: false,
				parser: 'babel',
				singleQuote: true,
				trailingComma: 'none',
				...prettierOptions
			}) :
			fileContent

		fse.outputFile(
			path.resolve(process.cwd(), filePath),
			fileContent,
			'utf8',
			(err) => {
				if (err) {
					throw err
				}
				resolve(filePath)
			}
		)
	})
}

const createFiles = async (config, context) => {
	const start = Date.now()
	const {
		beforeCreate,
		afterCreate,
		prettier
	} = config
	let opts = await beforeCreate(context)
	opts = opts ? Array.isArray(opts) ? opts : [opts] : []
	return opts.length ? Promise.all(opts.map(async opt => {
		const {
			templatePath,
			templateString,
			outputPath,
			params,
			beforeWriteFile
		} = opt
		const template = templateString ? templateString : await getTemplate(templatePath)
		let fileContent = ejs.compile(template, {})(params)
		if (typeof beforeWriteFile === 'function') {
			fileContent = beforeWriteFile(fileContent)
		}
		return writeFile(outputPath, fileContent, prettier)
	})).then(rs => {
		info(`[${packageJson.name}@${packageJson.version}]`, 'success', `${Date.now() - start}ms`)
		typeof afterCreate ==='function' && afterCreate(context)
	}) : logMethods.warn('[Warning] no options')
}

const execute = async () => {
	const options = getCommandOptions()
	const {
		config = 'ec.config.mjs', key
	} = options
	const cfg = await getConfig(options)
	const context = {
		name: key,
		helper: {
			...helper,
			// 命令行参数
			getProgramOpts() {
				return program.opts()
			}
		}
	}
	const {
		watchDir
	} = cfg
	if (!watchDir) {
		createFiles(cfg, context)
		return
	}
	createFiles(cfg, context)
	context.watchDir = watchDir
	const watched = path.resolve(process.cwd(), watchDir)
	watch.createMonitor(watched, function (monitor) {
		info('[watch]', watchDir)
		monitor.on("created", async (f, stat) => {
			if (stat.isFile()) {
				createFiles(cfg, context)
			}
		})
		monitor.on("changed", function (f, curr, prev) {

		})
		monitor.on("removed", async (f, stat) => {
			createFiles(cfg, context)
		})
		// monitor.stop(); // Stop watching
	})

}

execute()