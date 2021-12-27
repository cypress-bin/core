const getName = require("../../utils/get-name");
const xz = require("../../utils/xz");
const path = require('path');

const repack = async (platform, arch) => {
    const name = getName(platform, arch);
    const archive = path.join(__dirname, `${name}.zip`);

    await xz(`-v9 ${archive}`);

    return `${archive}.xz`;
};

module.exports = repack;