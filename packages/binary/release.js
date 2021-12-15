const download = require('./download.js');
const fs = require('fs');
const path = require('path');
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const argv = yargs(hideBin(process.argv)).argv;
const version = argv._[0];
const {AVAILABLE_ARCH_LIST, AVAILABLE_PLATFORMS} = require("../../utils/constants");
const getBinaryName = require("../../utils/get-binary-name");
const clean = require('../../utils/clean');
const exec = require('../../utils/exec');
const {NOT_FOUND} = require("../../utils/exit-codes");

const publish = async (platform, arch) => {
    const pkg = require(path.join(__dirname, './templates/package.json'));

    pkg.version = version;
    pkg.name = getBinaryName(platform, arch);
    pkg.description = `Binary files for Cypress on ${platform} ${arch}`;

    fs.writeFileSync(path.join(__dirname, 'package.json'), JSON.stringify(pkg, null, 2));

    console.log(`Start publish process for ${pkg.name}`);

    console.log('Clean artifacts');
    await clean('./**/*.zip');

    console.log(`Download binary`)
    await download(version, platform, arch);

    console.log('Publishing package');
    await exec('npm publish --access public', {cwd: __dirname})

    console.log(`Package ${pkg.name} has been published successfully`);
}

(async () => {
    if (!version) {
        console.error('Please specify version you want to deploy');
        process.exit(1);
    }

    for(let arch of AVAILABLE_ARCH_LIST) {
        for (let platform of AVAILABLE_PLATFORMS) {
            await publish(platform, arch)
        }
    }
})();
