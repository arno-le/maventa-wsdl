Introduction
============

A convenience wrapper for Maventa WSDL bank API.
Returns responses as nicely formatted JSON, works for me but might no work for you:
contributions are welcome!


Installation
============

`npm install maventa-wsdl`

Usage
=====

```js
const MaventaClient = require('./maventa-wsdl')

const client = new MaventaBankApi(vendorApiKey, userApiKey, companyUuid, false)

const hello = await maventaClient.helloWorld()
//'Hello from Bank API v1.0'

```

API
============================

Implements the Maventa WSDL methods[https://testing.maventa.com/apis/banks/wsdl]

helloWorld()

errorMessageList(from: Date, to:Date)

errorMessageShow( errorMessageId: string)

messageSend (message: string) 
(base64 encoded)

messageStatus(messageId: string)

RIMessageList(from: Date, to: Date)

RIMessageShow(messageId: string)

