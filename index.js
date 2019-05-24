'use strict'

const soap = require('soap')
const moment = require('moment')
const convert = require('xml-js')

/**
 * 
 * @param {string} vendorApiKey Maventa vendor api key
 * @param {string} userApiKey Maventa user api key
 * @param {string} companyUuid Maventa company unique identifier
 * @param {boolean} testing Testing or production environment, defaults to true
 * @param {boolean} useCompact Whether to use compact xml parsing format, defaults to true
 */
function MaventaBankApi(vendorApiKey, userApiKey, companyUuid, testing = true, useCompact = true) {
  this.testing = !!testing
  this.url = this.testing ? 'https://testing.maventa.com/apis/banks/wsdl' : 'https://secure.maventa.com/apis/banks/wsdl'
  this.defaultOptions = {
    api_keys: { vendor_api_key: vendorApiKey, user_api_key: userApiKey, company_uuid: companyUuid }
  }
  this.useCompact = useCompact
}

MaventaBankApi.prototype.getClient = async function() {
  if (this.client) {
    return Promise.resolve(this.client)
  } else {
    this.client = await soap.createClientAsync(this.url)
    return this.client
  }
}

// Public API
/**
 * Test that the API works
 */

MaventaBankApi.prototype.helloWorld = async function() {
  const client = await this.getClient()
  try {
    const res = await client.hello_worldAsync(null)
    const {
      return: { $value }
    } = res[0]
    return $value
  } catch (err) {
    return err.message
  }
}

/**
 * List error messages
 * @param {Date} from
 * @param {Date} to
 */
MaventaBankApi.prototype.errorMessageList = async function(from, to) {
  const client = await this.getClient()
  try {
    const res = await client.error_message_listAsync({
      ...this.defaultOptions,
      timestamp_start: formatMaventaDateTime(from),
      timestamp_end: formatMaventaDateTime(to)
    })
    const {
      return: {
        status: { $value },
        error_messages
      }
    } = res[0]
    console.log($value)
    console.log(client.lastRequest)

    if ($value !== 'OK') {
      throw Error($value)
    }
    return error_messages.item || []
  } catch (err) {
    return err.message
  }
}

/**
 * View a single error message
 * @param {String} errorMessageId of error message to show
 */
MaventaBankApi.prototype.errorMessageShow = async function(errorMessageId) {
  const client = await this.getClient()
  try {
    const res = await client.error_message_showAsync({
      ...this.defaultOptions,
      error_message_id: errorMessageId
    })
    console.log(res[0])
    const {
      return: {
        status: { $value },
        error_message
      }
    } = res[0]
    if ($value !== 'OK') {
      throw Error($value)
    }
    return removeSoapEnvelope(error_message.$value, this.useCompact)
  } catch (err) {
    return err.message
  }
}

/**
 * Sends a message (SI / RP)
 * @param {String} message as base64 string
 */
MaventaBankApi.prototype.messageSend = async function(message) {
  const client = await this.getClient()
  try {
    const res = await client.message_sendAsync({ ...this.defaultOptions, message: message })
    return res[0]
  } catch (err) {
    return err.message
  }
}

/**
 * Single message status
 * @param {UUID} messageId Message to get
 */
MaventaBankApi.prototype.messageStatus = async function(messageId) {
  const client = await this.getClient()
  try {
    const res = await client.message_statusAsync({ ...this.defaultOptions, messageId })
    const {
      return: {
        status: { $value }
      }
    } = res[0]

    return $value
  } catch (err) {
    return err.message
  }
}

/**
 * Get ReceiverInfo messages list
 * @param {Date} from
 * @param {Date} to
 */
MaventaBankApi.prototype.RIMessageList = async function(from, to) {
  const client = await this.getClient()
  try {
    const res = await client.ri_message_listAsync({
      ...this.defaultOptions,
      timestamp_start: formatMaventaDateTime(from),
      timestamp_end: formatMaventaDateTime(to)
    })
    const {
      return: {
        status: { $value },
        ri_message_ids
      }
    } = res[0]
    if ($value !== 'OK') {
      throw Error($value)
    }
    return ri_message_ids.item || []
  } catch (err) {
    return err.message
  }
}

/**
 * View a single RIMessage by UUID
 * @param {UUID} messageId
 */
MaventaBankApi.prototype.RIMessageShow = async function(messageId) {
  const client = await this.getClient()
  try {
    const res = await client.ri_message_showAsync({
      ...this.defaultOptions,
      ri_message_id: messageId
    })
    const {
      return: {
        status: { $value },
        ri_message
      }
    } = res[0]
    if ($value !== 'OK') {
      throw Error($value)
    } else if (
      !ri_message.attributes ||
      !ri_message.attributes['xsi:type'] ||
      ri_message.attributes['xsi:type'] !== 'n2:base64'
    ) {
      throw Error('Received a malformed message')
    }
    return removeSoapEnvelope(ri_message.$value, this.useCompact)
  } catch (err) {
    return err.message
  }
}

// Utils
const formatMaventaDateTime = function(d) {
  return moment(d).format('YYYYMMDDHHmmss')
}

const removeSoapEnvelope = function(value, compact) {
  try {
    const xml = Buffer.from(value, 'base64').toString()
    // Remove SOAP headers
    const arr = xml.split('</SOAP-ENV:Envelope>')
    // Parse into a compact object
    // https://github.com/nashwaan/xml-js#compact-vs-non-compact
    return convert.xml2js(arr[1], { compact })
  } catch (err) {
    throw err
  }
}

module.exports = MaventaBankApi
