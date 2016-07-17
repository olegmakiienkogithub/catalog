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
        this.tableName = 'advert';
    }

    /*
        Wrap setup
        Could be done to check different tables
        * currently will check only 'adverts' table
        * due to usage only Advert in system it is included in db directrly
     */
    init(callback) {
        this._listTables(w.error(callback, (tablesResult) => {
            if(tablesResult.TableNames.indexOf(this.tableName) === -1) {
                return this._createTable(this._getAdvertSchema(), callback);
            }
            callback();
        }));
    }

    _getAdvertSchema() {
        return {
            TableName : this.tableName,
            KeySchema: [       
                { AttributeName: 'id', KeyType: 'HASH' }  //Partition key
            ],
            GlobalSecondaryIndexes:[
                {
                    IndexName: 'id_index',
                    KeySchema: [
                        { AttributeName: 'active', KeyType: 'HASH' },
                        { AttributeName: 'id', KeyType: 'RANGE' }
                    ],
                    Projection: { ProjectionType: 'ALL' },
                    ProvisionedThroughput: { ReadCapacityUnits: 100, WriteCapacityUnits: 100 }
                },
                {
                    IndexName: 'title_index',
                    KeySchema: [
                        { AttributeName: 'active', KeyType: 'HASH' },
                        { AttributeName: 'title', KeyType: 'RANGE' }
                    ],
                    Projection: { ProjectionType: 'ALL' },
                    ProvisionedThroughput: { ReadCapacityUnits: 100, WriteCapacityUnits: 100 }
                },
                {
                    IndexName: 'fuel_index',
                    KeySchema: [
                        { AttributeName: 'active', KeyType: 'HASH' },
                        { AttributeName: 'fuel', KeyType: 'RANGE' }
                    ],
                    Projection: { ProjectionType: 'ALL' },
                    ProvisionedThroughput: { ReadCapacityUnits: 100, WriteCapacityUnits: 100 }
                },
                {
                    IndexName: 'price_index',
                    KeySchema: [
                        { AttributeName: 'active', KeyType: 'HASH' },
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
                { AttributeName: 'price', AttributeType: 'N' },
                { AttributeName: 'active', AttributeType: 'S' },
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
        // ASSUMPTION Added to support quering and sorting, yes it is bad
        item.active = 'yes';
        this.docClient.put({
            TableName: this.tableName,
            Item: item
        }, callback);
    }

    update(id, data, callback) {
        let params = Object.assign({}, this._buildUpdateExpression(data), {
            TableName: this.tableName,
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
            TableName: this.tableName,
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
            TableName: this.tableName,
            Key: {
                id: id
            }
        }, callback);
    }

    getAll(data, callback) {
        data.sort = data.sort || 'id';
        var params = {
            TableName: this.tableName,
            IndexName: `${data.sort}_index`,
            KeyConditionExpression: 'active = :active',
            ExpressionAttributeValues: { ':active': 'yes' },
            ScanIndexForward: true // ASSUMPTION no directional sort requested
        };
        this.docClient.query(params, function(e, response) {
            if(e) {
                return callback(e);
            }
            callback(null, response.Items);
        });
    }

    /*
        Private
     */
    
    _listTables(callback) {
        this.dynamodb.listTables(callback);
    }
    /*
        Create table using schema
     */
    _createTable(schema, callback) {
        this.dynamodb.createTable(schema, callback);
    }
    /*
        Only one table so drop it
     */
    _deleteTables(callback) {
        this.dynamodb.deleteTable({
            TableName: this.tableName
        }, callback);
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
