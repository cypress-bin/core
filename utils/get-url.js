const CYPRESS_DOWNLOAD_URL = 'https://download.cypress.io/desktop';

module.exports = (version, platform, arch) => `${CYPRESS_DOWNLOAD_URL}/${version}?platform=${platform}&arch=${arch}`;
