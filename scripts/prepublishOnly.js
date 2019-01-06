// Import modules
const fs = require('fs-extra');
const json = require('json-schema-fix');
const log = require('./helper/logger');
const path = require('./helper/path');
const run = require('./helper/run');

// Cancel if no App Framework development mode
if (!fs.pathExistsSync(path.project('.enableDevelopmentMode'))) process.exit(0);

// Reset templates/app/config.json to default values according schema
try {
  const schemaFile = path.templates('app-config-schema.json');
  const templateConfigFile = path.templates('app/config.json');
  const schema = fs.readJsonSync(schemaFile);
  fs.outputJsonSync(templateConfigFile, json.create(schema), { spaces: 2 });
  log.success('Reset templates/app/config.json file.');
} catch (e) {
  log.error('Failed to reset the templates/app/config.json file.');
}

// Run tests
if (run.script('test').code !== 0) process.exit(1);
// Check changelog update
try {
  const { version } = fs.readJsonSync(path.framework('package.json'))
  const changelogFile = path.framework('CHANGELOG.md');
  const changelogFileContent = fs.readFileSync(changelogFile, { encoding: 'utf-8' });
  const searchRegExp = new RegExp(`\\n### App Framework v${version}`, 'g')
  const searchRes = changelogFileContent.match(searchRegExp)
  if (searchRes === null) {
    log.error('No changelog entry found for version ' + version + '.')
  } else if (searchRes.length === 1) {
    log.success('Changelog entry found for version ' + version + '.')
  } else {
    log.error(searchRes.length + ' changelog entries found for version ' + version + '.')
  }
} catch (e) {
  log.error('Failed to check the changelog.');
}