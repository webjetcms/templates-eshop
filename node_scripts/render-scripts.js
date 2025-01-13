'use strict';
const fs = require('fs');
const upath = require('upath');
const sh = require('shelljs');
const UglifyJS = require('uglify-js');
const browserify = require('browserify');
const babelify = require('babelify');
const exorcist = require('exorcist');

module.exports = function renderScripts() {

    const sourcePath = upath.resolve(upath.dirname(__filename), '../src/js');
    const destPath = upath.resolve(upath.dirname(__filename), '../dist/.');

    sh.cp('-R', sourcePath, destPath)

    const sourcePathScriptsJS = upath.resolve(upath.dirname(__filename), '../src/js/ninja.js');
    const destPathScriptsJS = upath.resolve(upath.dirname(__filename), '../dist/js/ninja.js');
    const mapfile    = destPathScriptsJS + ".map";

    let bundler = browserify({
        debug: true // Povolenie source maps
    }).transform(babelify, {
        presets: ["@babel/preset-env"], // Transformácia ES modulov na CommonJS
        sourceMaps: true
    });

    bundler.add(sourcePathScriptsJS);


    bundler.bundle()
      .pipe(exorcist(mapfile))
      .pipe(fs.createWriteStream(destPathScriptsJS).on("finish", ()=>{
        console.log("Done writing file, reading: ", destPathScriptsJS);

        var minified = UglifyJS.minify(
          fs.readFileSync(destPathScriptsJS, 'utf8'), {
            mangle: {
              toplevel: true,
            },
            sourceMap: {
                filename: "ninja.js",
                url: "minja.min.js.map"
            }
          }
        );
        //console.log("minified=", minified);
        //console.log("min.js=", destPathScriptsJS.replace(".js", ".min.js"));

        fs.writeFileSync(
          destPathScriptsJS.replace(".js", ".min.js"),
          minified.code
        );
        fs.writeFileSync(
          destPathScriptsJS.replace(".js", ".min.js.map"),
          minified.map
        );
      }));
};
