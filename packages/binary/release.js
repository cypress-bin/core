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
const shell = require('shelljs');
const getName = require("../../utils/get-name");

const publish = async (platform, arch) => {
    const pkg = require(path.join(__dirname, './templates/package.json'));

    pkg.version = version;
    pkg.name = getBinaryName(platform, arch);
    pkg.description = `Binary files for Cypress on ${platform} ${arch}`;

    console.log(`[${version}] Start publishing ${pkg.name}`);

    const status = await download(version, platform, arch);

    if (status === 404) {
        console.log(`Binary not found for ${pkg.name}`);
        process.exit(1);
    }

    const rootDir = path.join(__dirname);
    const distDir = path.join(rootDir, `dist_${platform}_${arch}`);
    const zipName = `${getName(platform, arch)}.zip`;

    shell.mkdir(distDir);
    shell.mv(path.join(__dirname, zipName), path.join(distDir, zipName));

    fs.writeFileSync(path.join(distDir, 'package.json'), JSON.stringify(pkg, null, 2));

    await exec('npm publish --access public', {cwd: distDir})
    shell.rm('-rf', distDir);

    console.log(`[${version}] Package ${pkg.name} has been published successfully`);
}

(async () => {
    if (!version) {
        console.error('Please specify version you want to deploy');
        process.exit(1);
    }

    try {
        for(let arch of AVAILABLE_ARCH_LIST) {
            for (let platform of AVAILABLE_PLATFORMS) {
                await publish(platform, arch)
            }
        }
    } catch(e) {
        console.error('e',e);
        process.exit(1);
    }

    process.exit(0);
})();
