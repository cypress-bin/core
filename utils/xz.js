const commandExists = require('command-exists').sync;
const exec = require('./exec');
const os = require('os');
const fs = require('fs');
const path = require('path');

module.exports = async (command, options = {}) => {
    const platform = os.platform();
    const dir = path.join(__dirname, '../bin', platform);

    if (!fs.existsSync(dir)) {
        console.error(`Platform ${platform} not supported`);
        return;
    }

    const xz = path.join(dir, platform === 'win32' ? 'xz.exe' : 'xz');

    if (platform === 'linux') {
        if (commandExists('xz')) {
            return exec(`xz ${command}`, options);
        }
    }

    return exec(`${xz} ${command}`, options);
}
