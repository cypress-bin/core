const shell = require('shelljs');

module.exports = (command) => new Promise(resolve => {
   const e = shell.exec(command, {silent: true, async: false});

   resolve(e);
});