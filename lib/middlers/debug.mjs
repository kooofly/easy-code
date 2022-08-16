import { logMethods } from "../helper.mjs"

export default function (ctx, next) {
	const { commandOptions } = ctx
	ctx.debug = () => {
		return commandOptions.debug ? logMethods.debug : () => {}
	}
	next()
}