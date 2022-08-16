export default function (ctx, next) {
  const {
		config: { beforeCreate },
    helper: { logMethods: { error } }
	} = ctx
  const ret = (value) => {
    ctx.beforeCreateOptions = value ? Array.isArray(value) ? value : [value] : []
    if (!ctx.beforeCreateOptions.length) {
      error('[Error] no beforeCreateOptions')
      return
    }
    next()
  }
  beforeCreate(ctx, ret)
}