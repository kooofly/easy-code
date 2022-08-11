import { routeConfig } from './auto-router-example/router.params.mjs'
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
	},
	'auto-router': {
		// watchDir: 'auto-router-example/pages',
		prettier: true,
		async beforeCreate (ctx) {
			const { getExtension, getDirTree } = ctx.helper
			const wd = ctx.watchDir || 'auto-router-example/pages'

			const getFullRoutePath = (routeParamsMap, path) => {
				const keys = (routeParamsMap || {})[path] || []
				const isIndex = getExtension(path, '/') === 'index'
				return keys.reduce((prev, curr) => `${prev}/:${curr}`, isIndex ? '' : path) || '/'
			}

			const getParams = async () => {
				const pageImports = []
				const layoutImports = []
				const dirTree = await getDirTree(wd, function onEachFile(node) {
					const routePath = node.name.replace(node.extension, '')
					const routeName = node.relativePath.replace(node.extension, '').replace('/', '').replace(/\//g, '_')
					node.path = getFullRoutePath(routeConfig, `/${routePath}`)
					node.name = routeName
					node.component = routeName
					pageImports.push(`import ${routeName} from '@/pages${node.relativePath}'`)
					delete node.relativePath
					delete node.extension
					delete node.type
				}, function onEachDirectory (node) {
					const routePath = node.relativePath
					const routeName = routePath.replace('/', '').replace(/\//g, '_')
					node.path = routePath
					node.name = routeName
					node.component = `layout_${routeName}`
					if (node.relativePath) {
						layoutImports.push(`import ${node.component} from '@/layout/${routeName}.vue'`)
					}
					delete node.relativePath
					delete node.type
				})
	
				const routes = JSON.stringify(dirTree.children, null, 2).replace(/"component": "(.+)"/g, 'component: $1')
				return {
					layoutImports: layoutImports.join('\n'),
					pageImports: pageImports.join('\n'),
					routes
				}
			}			
			
			return [{
				templatePath: 'auto-router-example/template_router.js',
				outputPath: 'auto-router-example/output/router.ts',
				params: await getParams()
			}]
		}
	},
	
	command: {
		async beforeCreate (ctx) {
			const { getProgramOpts, firstToUpperCase } = ctx.helper
			const programOpts = getProgramOpts()
			const { params } = programOpts
			console.log({ programOpts })
			return [{
				templatePath: 'command-example/template.html',
				outputPath: `command-example/${firstToUpperCase(params)}.html`,
				params: {
					title: params
				}
			}]
		},
	}
}