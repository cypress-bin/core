const os = require('os');
const fs = require('fs');
const {AVAILABLE_PLATFORMS, AVAILABLE_ARCH_LIST, BIN_DIR} = require("./utils/constants");
const getName = require("./utils/get-name");
const clean = require("./utils/clean");
const path = require('path');
const getBinaryName = require('./utils/get-binary-name');
const tar = require('tar');

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
    return fs.existsSync(path.join(__dirname, getBinaryDir(platform, arch)));
}

const unpack = async (platform, arch) => {
    const name = getName(platform, arch);
    const archive = path.join(__dirname, getBinaryDir(platform, arch), `${name}.tgz`);
    const bin = path.join(__dirname, BIN_DIR);

    // clean
    await clean(bin)
    // recreate directory
    fs.mkdirSync(bin, {recursive: true});

    console.log(`Unpacking ${archive}`)
    tar.extract({ file: archive, sync: true, cwd: bin });
}

if (!checkIfSupportedPlatform(platform, arch)) {
    console.error(`Platform ${platform} ${arch} is not supported.`);
    process.exit(1);
}

if(!checkIfDependencyInstalled(platform, arch)) {
    console.error(`You should install ${getBinaryName(platform, arch)}`);
    process.exit(1);
}

(async () => {
    await unpack(platform, arch);
})();

