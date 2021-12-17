# cypress-bin

This package is dedicated for users that are behind a firewall, and have access only to npm registry.


## Installation
This library is an entrypoint. You need to install dedicated library for your OS and architecture. List of available binaries:
- @cypress-bin/binary-linux-x64
- @cypress-bin/binary-win32-x64

```
CYPRESS_INSTALL_BINARY=0 yarn add --dev cypress @cypress-bin/entrypoint @cypress-bin/binary-linux-x64 
```

Please make sure that you have the same version of cypress and cypress-bin installed. Otherwise, it can not work in some cases.

When `@cypress-bin/entrypoint` is installed, add env variable to let cypress know where to find binary:
```
export CYPRESS_RUN_BINARY=./node_modules/@cypress-bin/entrypoint/.bin/Cypress/Cypress
```

Or modify your package.json and add:
```
    "cypress:open": "CYPRESS_RUN_BINARY=./node_modules/@cypress-bin/entrypoint/.bin/Cypress/Cypress cypress open"
```
