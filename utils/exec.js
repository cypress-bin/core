const shell = require('shelljs');

module.exports = (command, options = {}) => new Promise(resolve => {
   if (options.cwd) {
      shell.pushd(options.cwd);
   }

   const result = shell.exec(command, {async: false});

   resolve(result);
});