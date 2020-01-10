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

### License

MIT

Copyright 2019 Arno Lehtonen

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

