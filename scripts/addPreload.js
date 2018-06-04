const fs = require('fs');
const path = require('path');
const packageJson = require('../package.json');
const pathToEntry = './build/index.html';
const bundlesRegExp = /\/static\/\w+\/\w+.[a-z0-9]+.\w{2,3}/g;
const builtHTMLContent = fs.readFileSync(path.resolve(pathToEntry)).toString();
const links = builtHTMLContent.match(bundlesRegExp);

let changedHTMLContent;


// To fix the slash issue if path add extra slash on the end or not
let homepagePath = (!!packageJson.homepage) ? packageJson.homepage.split('/').filter(st => st).join('/') : '';

links.forEach(link => {
    let fileType, fromReplace;
    // Check whether the file is css or not
    if(/\.css$/.test(link)) {
        fileType = 'style';
        fromReplace = `<link href="${homepagePath}${link}" rel="stylesheet">`;
    } 
    // Check whether the file is script or not
    else if(/\.js$/.test(link)) {
        fileType = 'script';
        fromReplace = `<script type="text/javascript" src="${homepagePath}${link}"></script>`;
    }

    changedHTMLContent = builtHTMLContent.replace(fromReplace, `<link rel="preload" href="${homepagePath}${link}" as="${fileType}">`);
});


// fs.writeFileSync(pathToEntry, fileWithPreload.join(''));