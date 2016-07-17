# Setup 

## Database
Download local db using:
```
./setup.sh
```
It will create directory `data` with dynamodb executables
To start database run command:
```
npm run db
```
Db will be running on port 8787. Database required for running functional tests

# Test

To run **unit** tests execute: `npm run test-unit`

To run **functional** tests run: `npm run test-funcitonal`

**Important!** Functional tests require local db to be running

To run all tests run (require db):
```
npm test
```

# Run http server

To run development server with local database connection
```
npm run dev
```
To run with connection to AWS (not tested). This will require to set correct ENV variables:
```
ACCESS_KEY=X SECRET_KEY=X npm start
```
Specify port for running application:
```
PORT=4545 npm start
```
# Development
To run tests (only unit) after each code change run in separate terminal:
```
npm run watch-test
```
Check for syntax errors:
```
npm run jshint
```

# Assumptions

- To see all assumptions made in project look for `ASSUMPTION` in code
- API for listing have possibility to order only by id, title, price and fuel fields only


