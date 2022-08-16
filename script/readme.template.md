# easy-code
`easy-code` is a tool for generate files use template.

For example:
* you can use it to generate model file
* you can use it to generate SPA route file, and watch folder change
* you can use it to generate other custom file etc.

# Installation

To install `easy-code` globally

```
npm install -g @kooofly/easy-code
```

To add `easy-code` as a dependency to you project

```
npm install --save-dev @kooofly/easy-code
```

# Usage

## Configuring `easy-code` with a configuration file

You can provide a javascript that exports a single configuration object. default file name is `ec.config.mjs`.

#### example
JavaScript configuration file example `ec.config.mjs`

```
<%- helloConfig %>
```

`template.html`

```
<%- helloTemplate %>
```

Then run the `easy-code` command:

```
ecode hello
```

output: output.html

```
<%- helloOutput %>
```

[More example](https://github.com/kooofly/easy-code/tree/main/example)

## Command-line arguments to `easy-code`

```
Usage: ecode [options]

Options:
  -V, --version                 output the version number
  -k, --key <config key>        config key
  -p, --params <custom params>  custom params. "ecode hello abc" or "ecode hello foo=1^bar=2"
  -c, --config <config file>    config file, default is ec.config.mjs
  -d, --debug <debug>           output debug info
  -h, --help                    display help for command
```

If you installed `easy-code` globally, run the `easy-code` command:

```
ecode -k YourCustomKey -p YourParams
```

or

```
ecode YourCustomKey YourParams
```

## Configuration

```
<%- dts %>
```

### Dependents

* EJS: [https://ejs.co](https://ejs.co/)
* Prettier: [https://www.npmjs.com/package/prettier](https://www.npmjs.com/package/prettier)
* fast-glob: [https://www.npmjs.com/package/fast-glob](https://www.npmjs.com/package/fast-glob)