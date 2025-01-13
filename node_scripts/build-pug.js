'use strict';
const upath = require('upath');
const sh = require('shelljs');
const renderPug = require('./render-pug');

const srcPath = upath.resolve(upath.dirname(__filename), '../src');

sh.find(srcPath).forEach(_processFile);

async function _processFile(filePath) {
    try {
        if (
            filePath.match(/\.pug$/)
            && !filePath.match(/include/)
            && !filePath.match(/mixin/)
            && !filePath.match(/\/pug\/layouts\//)
        ) {
            await renderPug(filePath, false);
        } else if (
            filePath.match(/\.png$/)
            && filePath.match(/pagebuilder/)
        ) {
            await renderPug(filePath, true);
        }
    } catch (err) {
        console.error(`### Build PUG ERROR: ${err.message}`);
    }
}
