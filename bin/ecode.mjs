#!/usr/bin/env node
import * as helper from '../lib/helper.mjs'
import Middleware from '../lib/middleware.mjs'
import commandOptions from '../lib/middlers/command-options.mjs'
import debug from '../lib/middlers/debug.mjs'
import config from '../lib/middlers/config.mjs'
import beforeCreateOptions from '../lib/middlers/before-create-options.mjs'
import generator from '../lib/middlers/generator.mjs'
import watcher from '../lib/middlers/watcher.mjs'

const middleware = new Middleware()

middleware.use(commandOptions)
middleware.use(debug)
middleware.use(config)
middleware.use(beforeCreateOptions)
middleware.use(generator)
middleware.use(watcher)

const context = {
	helper
}
middleware.handler(context)