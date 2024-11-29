# VerifierUi

**Important!** Before you proceed, please read
the [EUDI Wallet Reference Implementation project description](https://github.com/eu-digital-identity-wallet/.github/blob/main/profile/reference-implementation.md)

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0)

## Table of contents

* [Overview](#overview)
* [Development server](#development-server)
* [Code scaffolding](#code-scaffolding)
* [Build](#build)
* [How to run for development](#how-to-run-for-development)
* [Running tests](#running-tests)
* [License](#license)

## Overview

This is a WEB UI that provides functionality to interact with the Verifier/RP trusted end-point implemented [here](https://github.com/eu-digital-identity-wallet/eudi-srv-web-verifier-endpoint-23220-4-kt).
Another way to think of this application is that it represents an arbitrary application that wants to delegate to the trusted end-point the burden of
interacting with a wallet using OpenId4VP
The project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.2.5.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## How to run for development

You need npm (node version 18.15.0) and [Angular CLI](https://github.com/angular/angular-cli) installed on your machine.

In order to run Verifier UI run the following commands:

```
npm install
ng serve --proxy-config src/proxy.conf.json
```
The above command utilizes [proxy.conf.json](src/proxy.conf.json) that proxies the calls to the expected verifier backend service. 
Update this file if you want your Verifier UI to point to a locally running verifier backend service.    

You can access the application at [http://localhost:4200](http://localhost:4200) 

## Running tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## License

### Third-party component licenses

* [Angular CLI](https://github.com/angular/angular-cli)
* [cbor](https://github.com/hildjj/node-cbor)
* [jwt-decode](https://github.com/auth0/jwt-decode#readme)
* [rxjs](https://github.com/reactivex/rxjs)
* [qrcodejs](https://github.com/llyys/qrcodejs)

### License details

Copyright (c) 2023 European Commission

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
