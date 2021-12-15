const rimraf = require("rimraf");

module.exports = (path) => {
    return new Promise(resolve => rimraf(path, {}, resolve));
}
