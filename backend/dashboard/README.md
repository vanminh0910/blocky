<!--
title: Blocky Script API using AWS Serverless REST API with DynamoDB (offline support)
description: It provides a REST API to manage Scripts stored in Blocky application (https://github.com/vanminh0910/blocky).
layout: Doc
-->
# Blocky Script API using AWS Serverless REST API with DynamoDB (offline support)

## Setup

```bash
npm install
serverless dynamodb install
serverless offline start
```

## Run service offline

```bash
serverless offline start
```

## Usage

You can create, get, list, update, delete with the following commands:

### Create

```bash
curl -X POST -H "Content-Type:application/json" http://localhost:3000/scripts --data '{ "name": "Script 1, "xml": "<note>Notes</note>", "lua": "r = a + b"}'
```


No output
