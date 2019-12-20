'use strict';

const soap = require('soap');
const moment = require('moment');
const convert = require('xml-js');

/**
 * Maventa WSDL API client
 * @param {string} vendorApiKey Maventa vendor api key
 * @param {string} userApiKey Maventa user api key
 * @param {string} companyUuid Maventa company unique identifier
 * @param {boolean} testing Testing or production environment, defaults to true
 * @param {boolean} useCompact Whether to use compact xml parsing format, defaults to true
 */
class MaventaBankApi {
  constructor(vendorApiKey, userApiKey, companyUuid, testing = true, useCompact = true) {
    return (async () => {
      this.testing = !!testing;
      this.url = this.testing
        ? 'https://testing.maventa.com/apis/banks/wsdl'
        : 'https://secure.maventa.com/apis/banks/wsdl';
      this.defaultOptions = {
        api_keys: { vendor_api_key: vendorApiKey, user_api_key: userApiKey, company_uuid: companyUuid }
      };
      this.useCompact = useCompact;
      this.client = await soap.createClientAsync(this.url, {});
      return this;
    })();
  }

  // Public API
  /**
   * Test that the API works
   */

  helloWorld = async () => {
    try {
      const res = await this.client.hello_worldAsync(null);
      const {
        return: { $value }
      } = res[0];
      return $value;
    } catch (err) {
      return err.message;
    }
  };

  /**
   * List error messages
   * @param {Date} from
   * @param {Date} to
   */
  errorMessageList = async (from, to) => {
    try {
      const res = await this.client.error_message_listAsync({
        ...this.defaultOptions,
        timestamp_start: formatMaventaDateTime(from),
        timestamp_end: formatMaventaDateTime(to)
      });
      const {
        return: {
          status: { $value },
          error_messages
        }
      } = res[0];

      if ($value !== 'OK') {
        throw Error($value);
      }
      return error_messages.item || [];
    } catch (err) {
      return err.message;
    }
  };

  /**
   * View a single error message
   * @param {String} errorMessageId of error message to show
   */
  errorMessageShow = async errorMessageId => {
    try {
      const res = await this.client.error_message_showAsync({
        ...this.defaultOptions,
        error_message_id: errorMessageId
      });
      const {
        return: {
          status: { $value },
          error_message
        }
      } = res[0];
      if ($value !== 'OK') {
        throw Error($value);
      }
      return removeSoapEnvelope(error_message.$value, this.useCompact);
    } catch (err) {
      return err.message;
    }
  };

  /**
   * Sends a message (SI / RP)
   * @param {String} message as base64 string
   */
  messageSend = async message => {
    try {
      const res = await this.client.message_sendAsync({ ...this.defaultOptions, message: message });
      return res[0];
    } catch (err) {
      return err.message;
    }
  };

  /**
   * Single message status
   * @param {UUID} messageId Message to get
   */
  messageStatus = async function(messageId) {
    try {
      const res = await this.client.message_statusAsync({ ...this.defaultOptions, messageId });
      const {
        return: {
          status: { $value }
        }
      } = res[0];

      return $value;
    } catch (err) {
      return err.message;
    }
  };

  /**
   * Get ReceiverInfo messages list
   * @param {Date} from
   * @param {Date} to
   */
  RIMessageList = async (from, to) => {
    try {
      const res = await this.client.ri_message_listAsync({
        ...this.defaultOptions,
        timestamp_start: formatMaventaDateTime(from),
        timestamp_end: formatMaventaDateTime(to)
      });
      const {
        return: {
          status: { $value },
          ri_message_ids
        }
      } = res[0];
      if ($value !== 'OK') {
        throw Error($value);
      }
      return ri_message_ids.item || [];
    } catch (err) {
      return err.message;
    }
  };

  /**
   * View a single RIMessage by UUID
   * @param {UUID} messageId
   */
  RIMessageShow = async messageId => {
    try {
      const res = await this.client.ri_message_showAsync({
        ...this.defaultOptions,
        ri_message_id: messageId
      });
      const {
        return: {
          status: { $value },
          ri_message
        }
      } = res[0];
      if ($value !== 'OK') {
        throw Error($value);
      } else if (
        !ri_message.attributes ||
        !ri_message.attributes['xsi:type'] ||
        ri_message.attributes['xsi:type'] !== 'n2:base64'
      ) {
        throw Error('Received a malformed message');
      }
      return removeSoapEnvelope(ri_message.$value, this.useCompact);
    } catch (err) {
      return err.message;
    }
  };
}

// Utils
const formatMaventaDateTime = function(d) {
  return moment(d).format('YYYYMMDDHHmmss');
};

const removeSoapEnvelope = function(value, compact) {
  try {
    const xml = Buffer.from(value, 'base64').toString();
    // Remove SOAP headers
    const arr = xml.split('</SOAP-ENV:Envelope>');
    // Parse into a compact object
    // https://github.com/nashwaan/xml-js#compact-vs-non-compact
    return convert.xml2js(arr[1], { compact });
  } catch (err) {
    throw err;
  }
};

module.exports = MaventaBankApi;
