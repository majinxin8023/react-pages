'use strict';

const path = require('path');
const fs = require('fs');
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
const buildPath = process.env.BUILD_PATH || 'dist';

module.exports = {
    appPath: resolveApp('.'),
    appSrc: resolveApp('src'),
    appBuild: resolveApp(buildPath),
    appHtml: resolveApp(`src/index.html`),
    appIndexJs:  resolveApp(`src/index`),
    appPackageJson: resolveApp('package.json'),
    appTsConfig: resolveApp('tsconfig.json'),
    yarnLockFile: resolveApp('yarn.lock'),
    appNodeModules: resolveApp('node_modules'),
};