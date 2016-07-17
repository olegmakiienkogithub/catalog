'use strict';

const w = require('./wrap');
/*
    Wrapper for db operations

    ASUUMPTION DUe to only one 'entity' in system, db layer and 'entity' operations 
    recide in one file
 */

class Db {

    constructor(dynamodb, docClient) {
        this.dynamodb = dynamodb;
        this.docClient = docClient;
    }

    /*
        Wrap setup
        Could be done to check different tables
        * currently will check only 'adverts' table
        * due to usage only Advert in system it is included in db directrly
     */
    init(callback) {
        this._listTables(w.error(callback, (tablesResult) => {

            if(tablesResult.TableNames.indexOf('advert') === -1) {
                return this._createTable(this._getAdvertSchema(), callback);
            }
            callback();
        }));
    }

    _getAdvertSchema() {
        return {
            TableName : 'advert',
            KeySchema: [       
                { AttributeName: "id", KeyType: "HASH"},  //Partition key
            ],
            AttributeDefinitions: [       
                { AttributeName: "id", AttributeType: "S" }
            ],
            ProvisionedThroughput: {       
                ReadCapacityUnits: 10, 
                WriteCapacityUnits: 10
            }
        };
    }
    /*
        Advert CRUD
     */
    create(item, callback) {
        this.docClient.put({
            TableName: 'advert',
            Item: item
        }, w.handler('Create document', callback));
    }

    getById(id, callback) {
        this.docClient.get({
            TableName: 'advert',
            Key: {
                id: id
            }
        }, w.handler('Get document', callback));
    }
    /*
        Private
     */
    
    _listTables(callback) {
        this.dynamodb.listTables(w.handler('List tables', callback));
    }
    /*
        Create table using schema
     */
    _createTable(schema, callback) {
        this.dynamodb.createTable(schema, w.handler(`Create table ${this.tableName}`, callback));
    }
}

exports = module.exports = Db;
