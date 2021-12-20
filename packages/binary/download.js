const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const getUrl = require('../../utils/get-url');
const getName = require('../../utils/get-name');
const {NOT_FOUND} = require("../../utils/exit-codes");


const download = (version, platform, arch) => {
    const name = `${getName(platform, arch)}.zip`;

    return fetch(getUrl(version, platform, arch)).then(
        res => {
            if (res.status === 404) {
                console.error(`Package for version ${version} not found`);
                return 404;
            }

            return new Promise((resolve, reject) => {
                const dest = fs.createWriteStream(path.join(__dirname, name));
                res.body.pipe(dest);
                res.body.on('end', () => resolve(200));
                dest.on('error', reject);
            })
        }
    )
}


module.exports = download;