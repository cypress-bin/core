const simpleGit = require('simple-git');
const clean = require('./utils/clean');
const shell = require('shelljs');

const CYPRESS_DIR = 'cypress';
const git = simpleGit();

const getTags = async (repoPath) => {
    const semver = /tags\/v(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;
    const cgit = git.cwd(repoPath)

    return (await cgit.listRemote(['--tags'])).split('\n').map(line => line.match(semver)).filter(Boolean).map(version => version[0].replace('tags/v', ''));
}


(async () => {
    // await clean(CYPRESS_DIR);
    //
    // await git.clone('https://github.com/cypress-io/cypress.git', CYPRESS_DIR, {'--depth': 1});
    const cypressTags = await getTags(CYPRESS_DIR);
    const currentTags = await getTags('.');

    const newTags = cypressTags.filter(tag => !currentTags.includes(tag));

    if (!newTags.length) {
        console.log('No new tags. Skipping.');
        process.exit(0);
    }

    const extraNewTags = [newTags[0], newTags[1]];

    extraNewTags.forEach(tag => {
        console.log(`Generate release for ${tag}`)
        shell.exec(`node packages/binary/release.js ${tag}`);
    });
})();



