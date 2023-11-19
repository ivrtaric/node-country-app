# CountryApp (Node)

## Prerequisites

- Node 20
- Docker

## Initializing the database

Run `npm run db:init`

This will create a docker container with postgres 14.5 and populate it with provided data

### Shutting down the database

Run `npm run db:remove` to stop and remove the postgres docker container, and remove its volume

## Starting the application

Run `npm run start:local`

## Running integration tests

Run `npm run test:integration`

## Environment variables

- NODE_ENV
  - valid values: 'development', 'test', or 'production'
  - defaults to 'production' if not explicitly set, or if the value is not one
    of the values listed above

- PORT
  - the port on which the application will listen for requests
  - default: 3000

- BASE_PATH
  - a path prefixed to all API endpoints
  - default: '/'
  - e.g. PORT=3456 and BASE_PATH=/api/v1 will result in the application having
    the base URL http://localhost:3456/api/v1/

- database connection-related variables:
  - DB_HOST
    - default: localhost
  - DB_PORT
    - default: 5432
  - DB_USER
    - default: postgres
  - DB_PASSWORD
    - default: postgres
  - DB_NAME
    - default: countryapp
  - DB_POOL_SIZE
    - number of connections in the database connection pool the application will
      try to open on start
    - default: 5

- WORKERS
  - specifies the number of instances in the worker pool used for calculation-heavy
    processing the application will spin up on start
  - default: the number of CPU cores available on the system

- USE_ORM
  - boolean value specifying whether the application should use the ORM to access
    the database, or if it should use direct (raw) SQL queries
  - default: false
 
- LOG_LEVEL
  - valid values: 'TRACE', 'DEBUG', 'INFO', 'WARN', 'ERROR'
  - default: 'INFO'

- CONTAINER_NAME
  - prefix of the docker container name in which the application will run
  - required only when running the tests or using the `db:init` and `start:local` scripts
