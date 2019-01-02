const path = require('path');
const opn = require('opn');
const fs = require('fs-extra');
const run = require('./helper/run');
const log = require('./helper/logger');

const logFileName = 'ESLint.log.html';
const logFile = path.project(logFileName);
const cacheFile = path.cache('eslint/.eslintcache');
const appConfigFile = path.app('config.json');

const appConfig = fs.readJsonSync(appConfigFile);
const configFile = path.project('.eslintrc.json');

run.silent(`npx eslint "${path.project()}" --ignore-pattern "/node_modules/" --ignore-pattern "/build/" --ext .js --ext .vue --fix --config "${configFile}" --output-file "${logFile}" --format html --cache --cache-location "${cacheFile}"`, (error) => {
  if (error) {
    opn(logFile, { wait: false });
    log.error(`Failed ESLint test. Please open ${logFileName} for details.`);
  } else {
    if (appConfig.test.eslint.keepReportWhenPassed) {
      opn(logFile, { wait: false });
    } else {
      fs.remove(logFile);
    }
    log.success('Passed ESLint test.');
  }
});