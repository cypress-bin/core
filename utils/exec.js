const shell = require('shelljs');

module.exports = (command, options = {}) => new Promise(resolve => {
   if (options.cwd) {
      shell.pushd(options.cwd, { silent: true });
   }

   const e = shell.exec(command, {silent: false, async: false});

   resolve(e);
});