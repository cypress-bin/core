const simpleGit = require('simple-git');
const exec = require('./utils/exec');
const clean = require('./utils/clean');
const getBinaryName = require('./utils/get-binary-name');
const shell = require('shelljs');
const semver = require('semver');
const fs = require('fs');
const path = require('path');
const {AVAILABLE_PLATFORMS, AVAILABLE_ARCH_LIST} = require("./utils/constants");

const MIN_RELEASE_VERSION = '9.5.1';
const CYPRESS_DIR = 'cypress';
const git = simpleGit().addConfig('user.name', 'Piotr Sałkowski').addConfig('user.email', 'skc.peter@gmail.com');

const getTags = async (repoPath) => {
    const semver = /tags\/v(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;
    const cgit = git.cwd(repoPath)

    return (await cgit.listRemote(['--tags'])).split('\n').map(line => line.match(semver)).filter(Boolean).map(version => version[0].replace('tags/v', ''));
}

(async () => {
    await clean(CYPRESS_DIR);

    await git.clone('https://github.com/cypress-io/cypress.git', CYPRESS_DIR, {'--depth': 1});
    const cypressTags = await getTags(CYPRESS_DIR);
    const currentTags = await getTags('.');
    const newTags = cypressTags.filter(tag => !currentTags.includes(tag) && semver.gte(tag, MIN_RELEASE_VERSION));

    if (!newTags.length) {
        console.log('No new tags. Skipping.');
        process.exit(0);
    }

    for (let tag of newTags) {
        const { code, stderr } = await exec(`node packages/binary/release.js ${tag}`, { cwd: __dirname });

        if (code !== 0) {
            console.error(stderr);
            process.exit(code);
        }

        await git.tag([
            '-a', `v${tag}`,
            '-m', 'Automatic release based on Cypress tag'
        ]);

        await git.pushTags('origin');

        const peerDependency = AVAILABLE_PLATFORMS
            .map(platform => AVAILABLE_ARCH_LIST
                .map(arch => getBinaryName(platform, arch)))
            .reduce((a, b) => [...a, ...b], [])
            .map(name => ({ [name]: tag }))
            .reduce((a, b) => ({...a, ...b}), {});

        const pkg = require(path.join(__dirname, './templates/package.json'));

        pkg.version = tag;
        pkg.peerDependency = peerDependency;

        const rootDir = path.join(__dirname);
        const distDir = path.join(rootDir, 'dist');

        shell.mkdir('-p', path.join(distDir, 'utils'));
        shell.cp('-R', path.join(rootDir, 'unpack.js'), path.join(distDir, 'unpack.js'));
        shell.cp('-R', path.join(rootDir, 'utils/*'), path.join(distDir, 'utils'));

        fs.writeFileSync(path.join(distDir, 'package.json'), JSON.stringify(pkg, null, 2));

        console.log('Publishing package to npm registry');
        await exec('npm publish --access public', { cwd: distDir });

        shell.rm('-rf', distDir);
    }
})();
