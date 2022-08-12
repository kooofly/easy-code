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

To run `easy-code` with a configuration file, use the -c command-line option

If you installed `easy-code` globally, run the `easy-code` command:

```
ecode -c /path/to/conf.mjs -k YourCustomKey
```

JavaScript configuration file example `ec.config.mjs`
```
<%- helloExample %>
```

you can configure you own `package.json` like this:

```
{
  ...
  "scripts": {
    "hello": "ecode - -k hello"
    "watchAndAutoCreateRoutes": "ecode - -k auto-router"
    "useTemplateToCreateFileByFileName": "ecode - -k command -p"
  }
  ...
}
```
then you can run the command:
```
npm run watchAndAutoCreateRoutes
npm run useTemplateToCreateFileByFileName YourFileName
```
[More example](https://github.com/kooofly/easy-code/tree/main/example)

## Command-line arguments to `easy-code`
| Options                          | Description                          |
| :------------------------------- | :----------------------------------- |
| -c `<value>`, --config `<value>` | config file, default `ec.config.mjs` |
| -k `<value>`, --key `<value>`    | config key                           |
| -p `<value>`, --params `<value>` | custom params                        |
| -V, --version                    | output the version number            |
| -h, --help                       | display help for command             |


## Configuration

### Options
```
<%- dts %>
```
### Example

JavaScript configuration file example `ec.config.mjs`
```
<%- commandExample %>
```

### Dependents

* EJS: [https://ejs.co](https://ejs.co/)
* Prettier: [https://www.npmjs.com/package/prettier](https://www.npmjs.com/package/prettier)
* fast-glob: [https://www.npmjs.com/package/fast-glob](https://www.npmjs.com/package/fast-glob)