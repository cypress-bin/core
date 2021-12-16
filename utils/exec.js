const shell = require('shelljs');

module.exports = (command, options = {}) => new Promise(resolve => {
   if (options.cwd) {
      shell.pushd(options.cwd);
   }

   shell.exec(command, {async: false});

   resolve();
});