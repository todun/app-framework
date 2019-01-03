// Import modules
const fs = require('fs-extra');
const log = require('./helper/logger');
const path = require('./helper/path');
const run = require('./helper/run');

// Install Capacitor
if (run.script('install-capacitor').code !== 0) process.exit(1);

// Update Capacitor configuration
if (run.script('update-capacitor-config').code !== 0) process.exit(1);

// Add iOS project folder
const iosProjectFolder = path.project('ios');
if (fs.pathExistsSync(iosProjectFolder)) {
  log.info('iOS project folder already exists.');
} else {
  log.warning('Adding iOS project folder - this may take a while ...');
  const addIOSScript = run.loud('npx cap add ios');
  if (addIOSScript.code === 0) log.success('Added iOS project folder.');
  else log.error('Failed to add iOS project folder.');
}

// Updating the iOS folder
log.warning('Updating the iOS project folder - this may take a while ...');
const updateScript = run.loud('npx cap sync ios');
if (updateScript.code === 0) log.success('Updated the iOS project folder.');
else log.error('Failed to update the iOS project folder.');

// Open Xcode
run.loud('npx cap open ios');