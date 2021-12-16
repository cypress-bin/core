const AdmZip = require("adm-zip");
const tar = require('tar');
const fs = require('fs');
const getName = require("../../utils/get-name");
const path = require('path');

const repack = (platform, arch) => {
    const name = getName(platform, arch);
    const archive = path.join(__dirname, `${name}.zip`);
    const zip = new AdmZip(archive);
    const dest = path.join(__dirname, 'tmp');

    fs.rmSync(dest, { recursive: true, force: true });
    fs.mkdirSync(dest, { recursive: true });

    zip.extractAllTo(dest, true);

    tar.create({
        sync: true,
        gzip: {
            level: 9
        },
        cwd: dest,
        file: path.join(__dirname, `${name}.tgz`)
    }, ['Cypress']);
};

module.exports = repack;