# cypress-bin

This package is dedicated for users that are behind a firewall, and have access only to npm registry.


## Installation
In order to install it, please run:
```
CYPRESS_INSTALL_BINARY=0 yarn add --dev cypress cypress-bin 
```

Please make sure that you have the same version of cypress and cypress-bin installed. Otherwise, it can not work in some cases.

When `cypress-bin` is installed, add env variable to let cypress know where to find binary:
```
export CYPRESS_RUN_BINARY=./node_modules/cypress-bin/.bin/Cypress/Cypress
```

Or modify your package.json and add:
```
    "cypress:open": "CYPRESS_RUN_BINARY=./node_modules/cypress-bin/.bin/Cypress/Cypress cypress open"
```
