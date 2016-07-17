# About

Sapmle http service written in nodejs. As persistant storage use dynamodb frovided in AWS. For local run use locally runnable instance of database.

# Api
Provide JSON REST api for one entity `advert` (car selling advertisement).

#### General
Each API endpoint return data in json format. 
In case of error response will have one of provided formats:
```
{
	"error": "error message"
}
{
	"error": ["error message", "second error message"]
}
```
Errors has http status code `400 Bad request`.
In success case response will have format:
```
{
	"data": <data returned by action>
}
```
Success responses has http code `200 ok`

# Api endpoints

## POST /advert (Create advert)
### Request json object
Parameter | format | usage | comment
--- | --- | --- | --- 
title | string [1..255]| required | 
fuel | string, enum: gasoline, diesel | required | 
price | integer [1..1000000000] | required | 
new | boolean | required | 
mileage | integer [1..1000000000]| optional | required for new: false 
firstRegistration | string (date format) | optional | required for new: false, format is from RFC3339 'yyyy-mm-dd'(2016-11-22)
### Response
```
{
  "data": <advert>
}
```

## POST /advert/:id (Update existing advert)
### Url parameters
Parameter | format | usage
--- | --- | --- 
id | uuid | required

### Request json object
Same fields as for Create (POST /advert)
### Response
```
{
  "data": <advert>
}
```

## GET /advert (list adverts)
Will give results sorted by specified field in request
### Request json object
Parameter | format | usage | comment
--- | --- | --- | --- 
sort | string, enum: id, title, price, fuel | optional | default value is 'id"
### Response
```
{
  "data": [<advert>, <advert>]
}
```

## GET /advert/:id (get one advert)
### Url parameters
Parameter | format | usage
--- | --- | --- 
id | uuid | required

### Response
```
{
  "data": <advert>
}
```

## DELETE /advert/:id (delete existing advert)
### Url parameters
Parameter | format | usage
--- | --- | --- 
id | uuid | required

### Response
```
{
  "data": {
  	"id": ..
  }
}
```
# Setup 

Require nodejs v 4.2 to be installed.

You could install `node` with `nvm` https://github.com/creationix/nvm
Then run:
```
nvm install 4.2
nvm use 4.2
```

## Database
Download local db. It will create directory `data` with dynamodb executables:
```
./setup.sh
```
Install requirements:
```
npm install
```
Start database to run local server or run funcitonal tests
```
npm run db
```
Db will be running on port 8787.

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
- API for listing have possibility to order only by id, title, price and fuel fields only.
- Listing API dont have pagination
- Integer fields have some maximum limitation set to 1000000000 to reduce possible wrong values.

# Decisions
- Most of the options could be set thru `ENV` variables
- `async` used not always, sometimes you could see 'callback hell'
- used express to reduce amount of code.
- using Promise / generators not added due to aws-sdk callback approach and possible less wrapping with `co`
- dynamodb has complicated way of creating partition and secondary indexes, so implemented only few in 'sort'
- lib/db has mixed funcitonality of database wrapper and model due to only one 'entity' in system
- no logger uses, just plain console.log to keep project simple
- `jsonschema` used to reduce amount of if's, it helps when there are big amount of parameters, adding new ones will have less efforts
- all setup and run scripts runned by 'npm' except setup.sh
- action folder has controller + service funcitonality (from MVC), kept in one file to be simple




