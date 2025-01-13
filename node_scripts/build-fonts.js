const copyfiles = require('copyfiles');
console.log('Copying font files and CSS file...');

// Kopírovanie fontov a CSS súborov do dist priečinka
const copyOptions = {
    up: 1,
};

const copyFontFiles = [
    'node_modules/bootstrap-icons/font/fonts/*',
    'dist/assets/fonts',
];

const copyCssFile = [
    'node_modules/bootstrap-icons/font/bootstrap-icons.css',
    'dist/css',
];

// Kopírovanie súborov
function copyFiles() {
    copyfiles(copyFontFiles, copyOptions, (err) => {
        if (err) {
            console.error('Error copying font files:', err);
            process.exit(1);
        }
        console.log('Font files copied successfully.');
    });

    copyfiles(copyCssFile, copyOptions, (err) => {
        if (err) {
            console.error('Error copying CSS file:', err);
            process.exit(1);
        }
        console.log('CSS file copied successfully.');
    });
}

// Volanie funkcie na skopírovanie súborov
copyFiles();
