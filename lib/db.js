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
                { AttributeName: 'id', KeyType: 'HASH' }  //Partition key
            ],
            GlobalSecondaryIndexes:[
                {
                    IndexName: 'title_index',
                    KeySchema: [
                        { AttributeName: 'id', KeyType: 'HASH' },
                        { AttributeName: 'title', KeyType: 'RANGE' }
                    ],
                    Projection: { ProjectionType: 'ALL' },
                    ProvisionedThroughput: { ReadCapacityUnits: 100, WriteCapacityUnits: 100 }
                },
                {
                    IndexName: 'fuel_index',
                    KeySchema: [
                        { AttributeName: 'id', KeyType: 'HASH' },
                        { AttributeName: 'fuel', KeyType: 'RANGE' }
                    ],
                    Projection: { ProjectionType: 'ALL' },
                    ProvisionedThroughput: { ReadCapacityUnits: 100, WriteCapacityUnits: 100 }
                },
                {
                    IndexName: 'price_index',
                    KeySchema: [
                        { AttributeName: 'id', KeyType: 'HASH' },
                        { AttributeName: 'price', KeyType: 'RANGE' }
                    ],
                    Projection: { ProjectionType: 'ALL' },
                    ProvisionedThroughput: { ReadCapacityUnits: 100, WriteCapacityUnits: 100 }
                }
            ],
            AttributeDefinitions: [       
                { AttributeName: 'id', AttributeType: 'S' },
                { AttributeName: 'title', AttributeType: 'S' },
                { AttributeName: 'fuel', AttributeType: 'S' },
                { AttributeName: 'price', AttributeType: 'N' }
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

    update(id, data, callback) {
        let params = Object.assign({}, this._buildUpdateExpression(data), {
            TableName: 'advert',
            Key: {
                id: id
            },
            ReturnValues: "ALL_NEW"
        });
        this.docClient.update(params, function(e, response) {
            if(e) {
                return callback(e);
            }
            if(!response.Attributes) {
                return callback('Item not returned in response');
            }
            callback(null, response.Attributes);
        });
    }

    getById(id, callback) {
        this.docClient.get({
            TableName: 'advert',
            Key: {
                id: id
            }
        }, function(e, response) {
            if(e) {
                return callback(e);
            }
            if(!response.Item) {
                return callback('Item not found');
            }
            callback(null, response.Item);
        });
    }

    deleteById(id, callback) {
        this.docClient.delete({
            TableName: 'advert',
            Key: {
                id: id
            }
        }, w.handler('Delete document', callback));
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
    /*
        Will build update expression with provided data
        * will escape only 'new' reserved keyword
     */
    _buildUpdateExpression(data) {
        let names = {};
        let values = {};
        let pairs = [];

        let keys = Object.keys(data);
        for(let key of keys) {
            let value = data[key];
            let pairKey = key;

            if(key === 'new') {
                key = 'n';
                pairKey = '#n';
                names['#n'] = 'new';
            }
            values[`:${key}`] = value;
            pairs.push(`${pairKey} = :${key}`);
        }

        return {
            UpdateExpression: `set ${pairs.join(', ')}`,
            ExpressionAttributeNames: names,
            ExpressionAttributeValues: values
        };
    }
}

exports = module.exports = Db;
