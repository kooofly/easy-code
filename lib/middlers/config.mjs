export default async function (ctx, next) {
  const {
		commandOptions: { config = 'ec.config.mjs', key },
		helper: { importModule }
	} = ctx
	const cfg = await importModule(config)
	ctx.debug('[config]', key, cfg.default[key])
	ctx.config = cfg.default[key]
  next()
}