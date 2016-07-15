#!/bin/sh

# Clean before
rm -Rf ./data
mkdir data
# Download dynamodb
curl http://dynamodb-local.s3-website-us-west-2.amazonaws.com/dynamodb_local_2016-05-17.zip -o ./data/dynamodb_local_latest.zip
# Unpack zip archive
unzip ./data/dynamodb_local_latest.zip -d ./data
# Clean downloadable zip
rm -Rf ./data/dynamodb_local_latest.zip
