import h from './hello-example/config.mjs'
import a from './auto-router-example/config.mjs'
import c from './command-example/config.mjs'
import w from './watch-example/config.mjs'
export default {
	hello: h.hello,
	'auto-router': a['auto-router'],
	command: c.command,
	watch: w.watch
}