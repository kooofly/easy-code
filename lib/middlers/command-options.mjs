import module  from 'module'
import queryString from 'query-string'
import { Command } from 'commander'
const { createRequire } = module
const require = createRequire(import.meta.url)
const packageJson = require('../../package.json')

export default function (ctx, next) {
  const program = new Command()
  program.version(packageJson.version)
  program
		.option('-k, --key <config key>', 'config key')
		.option('-p, --params <custom params>', 'custom params. "ecode hello abc" or "ecode hello foo=1^bar=2"')
		// .option('-f, --file <create file name>', 'create file name')
		.option('-c, --config <config file>', 'config file, default is ec.config.mjs')
		.option('-d, --debug <debug>', 'output debug info')
	program.parse(process.argv)
	const argv = process.argv
	let options = program.opts()
	let maybeParams = argv[3]
	if (!options || !options.key) {
		options.key = argv[2]
		options.params = argv[3]
		if (/=/.test(maybeParams)) {
			options.params = queryString.parse(maybeParams.replace(/\^/g, '&'))
		}
	}
	ctx.name = options.key
  ctx.commandOptions = options
  next()
}