# FinAccount
Financial accounts for miipay

* e2e-tests: [![Node.js CI](https://github.com/miipay/FinAccount/actions/workflows/e2e-test.yaml/badge.svg)](https://github.com/miipay/FinAccount/actions/workflows/e2e-test.yaml)

## Installation

```bash
$ yarn
```

## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# e2e tests - local or development
$ yarn test:e2e:startdb
$ yarn test:e2e:local
$ yarn test:e2e:stopdb

# test coverage
$ yarn test:cov
```

## License

Nest is [MIT licensed](LICENSE).
