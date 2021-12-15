const { spawn } = require("child_process");
const download = require('./download.js');
const fs = require('fs');
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const argv = yargs(hideBin(process.argv)).argv;
const version = argv._[0];
const rimraf = require('rimraf');
const {AVAILABLE_ARCH_LIST, AVAILABLE_PLATFORMS} = require("../../utils/constants");
const getBinaryName = require("../../utils/get-binary-name");

const publish = async (platform, arch) => {
    const pkg = require('./templates/package.json');

    pkg.version = version;
    pkg.name = getBinaryName(platform, arch);
    pkg.description = `Binary files for Cypress on ${platform} ${arch}`;

    fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));

    console.log(`Start publish process for ${pkg.name}`);

    console.log('Clean artifacts');
    await clean('*.zip');

    console.log(`Download binary`)
    await download(version, platform, arch);

    console.log('Publishing package');
    const command = spawn("npm", ['publish', '--access', 'public']);
    command.stdout.on("data", data => console.log(`${data}`));
    command.stderr.on("data", err => console.error(`${err}`));
    command.on('error', (error) => console.error(error.message));

    console.log(`Package ${pkg.name} has been published successfully`);
}

const clean = (path) => {
    return new Promise(resolve => rimraf(path, {}, resolve));
}

(async () => {
    if (!version) {
        console.error('Please specify version you want to deploy');
        process.exit(1);
    }

    AVAILABLE_ARCH_LIST.forEach((arch) => {
        AVAILABLE_PLATFORMS.forEach(async (platform) => {
            await publish(platform, arch)
        });
    });
})();
