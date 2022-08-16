import { snakeCase, camelCase, upperFirst, lowerFirst } from 'lodash-es'
import path from 'path'
const templatePath = 'template-router.js'
const watchFiles = [templatePath, 'router.params.js']
export default {
  'auto-router': {
    watchPaths: ['src/pages/.'].concat(watchFiles),
    onWatch ({ event, path, stats }, next) {
      if (watchFiles.includes(path) && event === 'change') {
        console.log(event, path)
        next()
      }
    },
    async beforeCreate (ctx, next) {
      const { getExtension, getFileName, getDirTree, importDeCache } = ctx.helper
      const wd = 'src/pages'
      const routeConfig = importDeCache('./router.params.js')
      const getFullRoutePath = (routeParamsMap, path, name) => {
        const keys = (routeParamsMap || {})[name] || []
        const isIndex = getExtension(path, '/') === 'index'
        return isIndex ? '' : keys.reduce((prev, curr) => `${prev}/:${curr}`, isIndex ? '' : path)
      }

      const clearNode = (node) => {
        delete node.relativePath
        delete node.extension
        delete node.type
        delete node.id
      }

      const isRoot = (node) => !/\//.test(getFileName(node.relativePath, '/'))

      const getParams = async () => {
        const pageImports = []
        const layoutImports = []
        const dirTree = await getDirTree(wd, function onEachFile (node) {
          const componentName = upperFirst(camelCase(node.id))
          const routePath = node.name.replace(node.extension, '')
          node.name = snakeCase(node.id)
          const isHome = node.name === 'index'
          node.path = isHome
            ? '/'
            : getFullRoutePath(
              routeConfig,
              isRoot(node) ? `/${lowerFirst(routePath)}` : lowerFirst(routePath),
              node.name
            )
          node.component = componentName
          pageImports.push(`import ${componentName} from '@/pages${node.relativePath}'`)
          clearNode(node)
        }, function onEachDirectory (node) {
          const componentName = upperFirst(camelCase(node.id))
          node.name = snakeCase(componentName)
          node.path = getFullRoutePath(
            routeConfig,
            isRoot(node) ? `/${getExtension(node.relativePath, '/')}` : getExtension(node.relativePath, '/'),
            node.name
          )
          node.component = `Layout${componentName}`
          if (node.relativePath) {
            layoutImports.push(`import ${node.component} from '@/layouts/${componentName}.vue'`)
          }
          clearNode(node)
        })

        const routes = JSON.stringify(dirTree.children, null, 2).replace(/"component": "(.+)"/g, 'component: $1')
        return {
          layoutImports: layoutImports.join('\n'),
          pageImports: pageImports.join('\n'),
          routes
        }
      }

      next({
        override: true,
        format: true,
        template: `@/${templatePath}`,
        output: 'src/_/router.ts',
        params: await getParams()
      })
    }
  }
}
