# Setup 

## Database
Download local db using:
```
./setup.sh
```
It will create directory `data` with dynamodb executables

# Test

To run tests execute:
```
npm test
```

# Run

## Run db
To start database run command:
```
npm run db
```
Db will be running on port 8787

# Run http server
Run on default port 8080:
```
npm start
```
Specify port for running application:
```
ENV PORT=4545 npm start
```
