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
Db will be running on port 8787. Database required for running funcitonal tests

# Test

To run **unit** tests execute: `npm run test-unit`

To run **functional** tests run: `npm run test-funcitonal`

**Important!** Functional tests require local db to be running

To run all tests run (require db):
```
npm test
```

# Run http server
Run on default port 8000:
```
npm start
```
Specify port for running application:
```
ENV PORT=4545 npm start
```
