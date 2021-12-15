const fetch = require('node-fetch');
const fs = require('fs');
const getUrl = require('../../utils/get-url');
const getName = require('../../utils/get-name');


const download = (version, platform, arch) => {
    const name = `${getName(platform, arch)}.zip`;

    console.log(`Downloading ${name}`);

    return fetch(getUrl(version, platform, arch)).then(
        res =>
            new Promise((resolve, reject) => {
                const dest = fs.createWriteStream(name);
                res.body.pipe(dest);
                res.body.on('end', () => resolve());
                dest.on('error', reject);
            })
    )
}


module.exports = download;