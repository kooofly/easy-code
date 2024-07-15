import generator from './generator.mjs'
import beforeCreateOptions from './before-create-options.mjs'
import chokidar from 'chokidar'
import Middleware from '../middleware.mjs'
import slash from 'slash'
export default function (ctx, next) {
  const {
		config: {
			watchPaths,
			watchOptions,
			onWatch
		},
		helper: { isFunction }
	} = ctx

	const middleware = new Middleware()
	middleware.use(beforeCreateOptions)
	middleware.use(generator)

	if (!watchPaths) {
		return
	}
	ctx.watchPaths = watchPaths

	const watcher = chokidar.watch(watchPaths, {
		alwaysStat: true,
		ignoreInitial: true,
		...watchOptions
	})
	watcher.on('all', (event, path, stats) => {
		let isCustom = false
		const nt = (opt) => {
			isCustom = true
			if (opt && opt.stop) {
				return
			}
			middleware.handler(ctx)
		}

		if (isFunction(onWatch)) {
			onWatch({ event, path: slash(path), stats }, nt)
		}

		if (isCustom) {
			return
		}

		if (
			stats && stats.isFile() && event !== 'change'
			|| event === 'unlink'
		) {
			middleware.handler(ctx)
		}
	})
}