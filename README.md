Introduction
============

A convenience wrapper for Maventa WSDL bank API converting SOAP responses to friendly JSON.

Installation
============

`npm i maventa-wsdl`  

Requires Node >= 8.8

Usage
=====

```js
const MaventaClient = require('maventa-wsdl')

const client = await new MaventaClient(vendorApiKey, userApiKey, companyUuid, true)

const hello = await client.helloWorld()
//'Hello from Bank API v1.0'

```

All methods are Promise based.

API
============================

Implements the Maventa WSDL methods: https://testing.maventa.com/apis/banks/wsdl

### Initializing the client
As the SOAP client is constructed asynchronously, use `await` to wait for the constructor to complete.  

```js 
const client = await new MaventaBankApi(vendorApiKey, userApiKey, companyUuid, testing, useCompact)
```
  
#### Parameters  
  `vendorApiKey: string` Maventa vendor api key  
  `userApiKey: string` Maventa user api key  
  `companyUuid: string` Maventa company unique identifier  
  `testing: boolean` Testing or production environment, defaults to true  
  `useCompact: boolean` Whether to use compact xml parsing format, defaults to true  

### Methods

`helloWorld()`

`errorMessageList(from: Date, to:Date)`

`errorMessageShow(errorMessageid: string)`

`messageSend (message: string)` 
(base64 encoded xml message)

`messageStatus(messageId: string)`

`RIMessageList(from: Date, to: Date)`

`RIMessageShow(messageId: string)`

