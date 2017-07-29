<!--
title: Blocky User API using AWS Serverless REST API with DynamoDB (offline support)
description: It provides a REST API to manage Users stored in Blocky application (https://github.com/vanminh0910/blocky).
layout: Doc
-->
# Blocky User API using AWS Serverless REST API with DynamoDB (offline support)

## Setup

```bash
serverless dynamodb install
```

## Run service offline

```bash
serverless offline start
```

## Usage

You can signup, login, update user profile, change password with the following commands:

### Signup

```bash
curl -X POST -H "Content-Type:application/json" http://localhost:3000/signup --data '{ "email": "abc@abc.com, "password": "secure" }'
```

### Login

```bash
curl -X POST -H "Content-Type:application/json" http://localhost:3000/login --data '{ "email": "abc@abc.com, "password": "secure" }'
```

### Change Password

```bash
curl -X POST -H "Content-Type:application/json" http://localhost:3000/changePassword --data '{ "password": "old password", "newPassword": "new password" }'
```


No output
