#!/usr/bin/env node
const publish = require('./src/publish')
const run = require('execa')

const yargs = require('yargs')
  .option('dry-run', {
    describe: 'Print what will be done without doing it',
    default: process.env.INPUT_DRY_RUN || false,
    type: 'boolean'
  })
  .option('dir', {
    describe: 'Path to the directory that contains the package.json to publish',
    type: 'string',
    default: process.env.INPUT_DIR || '.'
  })
  .option('default-branch', {
    describe: 'Default branch to use for merge releases',
    type: 'string',
    default: process.env.INPUT_DEFAULT_BRANCH || 'master'
  })
  .option('release-tag', {
    describe: 'Override tag to release package with',
    type: 'string',
    default: process.env.INPUT_RELEASE_TAG || 'latest'
  })
  .alias('help', 'h')

const options = yargs.argv

if (options.help) {
  yargs.showHelp()
  process.exit(0)
}

const npmArgs = options._
delete options._

console.warn(`[publish] options: ${JSON.stringify(options, null, 2)}`)
console.warn(`[publish] npm args: ${JSON.stringify(npmArgs, null, 2)}`)

run('npm', ['i', '-g', 'vsce'])
  .then(() => {
    return publish(options, npmArgs)
  })
  .then(context => {
    console.warn(`published! ${JSON.stringify(context, null, 2)}`)
  })
  .catch(error => {
    console.error(error)
    process.exitCode = 1
  })
