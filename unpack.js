const os = require('os');
const rimraf = require('rimraf');
const AdmZip = require('adm-zip');
const {AVAILABLE_PLATFORMS, AVAILABLE_ARCH_LIST, BIN_DIR, DOWNLOAD_DIR} = require("./utils/constants");
const getName = require("./utils/get-name");
const path = require('path');
const getBinaryName = require('./utils/get-binary-name');

const arch = os.arch();
const platform = os.platform();

const getBinaryDir = (platform, arch) => {
    return `./../../${getBinaryName(platform, arch)}/`;
};

const checkIfSupportedPlatform = (platform, arch) => {
    if (!AVAILABLE_PLATFORMS.includes(platform)) {
        return false;
    }

    return AVAILABLE_ARCH_LIST.includes(arch);
}

const checkIfDependencyInstalled = (platform, arch) => {
    return fs.existsSync(getBinaryDir(platform, arch));
}

const unpack = (platform, arch) => {
    const name = getName(platform, arch);
    const archive = path.join(__dirname, getBinaryDir(platform, arch), `${name}.zip`);

    console.log(`Unpacking ${archive}`)

    const zip = new AdmZip(archive);

    rimraf(BIN_DIR, {}, () => {
        zip.extractAllTo(BIN_DIR, true);
    });
}

if (!checkIfSupportedPlatform(platform, arch)) {
    console.error(`Platform ${platform} ${arch} is not supported.`);
    process.exit(1);
}

if(!checkIfDependencyInstalled(platform, arch)) {
    console.error(`You should install ${getBinaryName(platform, arch)}`);
    process.exit(1);
}

unpack(platform, arch);
